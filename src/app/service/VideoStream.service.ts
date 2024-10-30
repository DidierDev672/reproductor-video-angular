import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';
import Hls from 'hls.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStreamService {
  private hls: Hls | null = null;
  private dashPlayer: dashjs.MediaPlayerClass | null = null;

  // Observables para métricas
  private currentQuality = new BehaviorSubject<String>('');
  private bandwidth = new BehaviorSubject<number>(0);

  constructor() { }

  initializeStream(videoElement: HTMLVideoElement, streamUrl: string) {
    if (this.isHLSStream(streamUrl)) {
      this.initializeHLS(videoElement, streamUrl);
    } else if (this.isDASHStream(streamUrl)) {
      this.initializeDASH(videoElement, streamUrl);
    }
  }

  private initializeHLS(video: HTMLVideoElement, url: string) {
    if (Hls.isSupported()) {
      this.hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
      });

      this.hls.loadSource(url);
      this.hls.attachMedia(video);

      // Eventos de monitoreo.
      this.hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const quality = this.hls?.levels[data.level];
        this.currentQuality.next(`${quality?.height}p`);
      });

      this.hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        const total = (data.frag.stats.loading.start + data.frag.stats.loading.end) / 2;
        const bandwidth = data.frag.stats.loaded * 8 / total;
        this.bandwidth.next(bandwidth);
      });
    }
  }

  private initializeDASH(video: HTMLVideoElement, url: string) {
    this.dashPlayer = dashjs.MediaPlayer().create();
    this.dashPlayer.initialize(video, url, true);

    this.dashPlayer.updateSettings({
      'streaming': {
        'abr': {
          'useDefaultABRRules': true,
          'autoSwitchBitrate': {
            'video': true
          }
        }
      }
    });

    // Monitore0 de calidad.
    this.dashPlayer.on('qualityChangeRequested', (e) => {
      const qualities = this.dashPlayer?.getBitrateInfoListFor('video');
      if (qualities && qualities[e.newQuality]) {
        this.currentQuality.next(`${qualities[e.newQuality].height}p`);
      }
    });
  }

  private isHLSStream(url: string): boolean {
    return url.includes('.m3u8');
  }

  private isDASHStream(url: string): boolean {
    return url.includes('.mpd');
  }

  // Métodos para control manual de calidad.
  setQuality(level: number) {
    if (this.hls) {
      this.hls.currentLevel = level;
    } else if (this.dashPlayer) {
      this.dashPlayer.setQualityFor('video', level);
    }
  }


  // Obtener métricas actuales.
  getCurrentMetrics() {
    if (this.hls) {
      return {
        bandwidth: this.hls.bandwidthEstimate,
        level: this.hls.currentLevel,
        levels: this.hls.levels,
      };
    } else if (this.dashPlayer) {
      return {
        bandwidth: this.dashPlayer.getAverageThroughput('video'),
        quality: this.dashPlayer.getQualityFor('video'),
        qualities: this.dashPlayer.getBitrateInfoListFor('video'),
      }
    }
    return null;
  }
  destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.dashPlayer) {
      this.dashPlayer.destroy();
      this.dashPlayer = null;
    }
  }

}
