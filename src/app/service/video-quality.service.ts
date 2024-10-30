import { Injectable } from '@angular/core';
import { VideoQuality } from '../domain/video-quality.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoQualityService {
  private readonly qualities: VideoQuality[] = [
    {
      id: '46f5cdef-4493-4a35-bb7a-ffaba633cd98',
      label: '1080p',
      src: '../../assets/Clair Obscur/1080/Clair Obscur： Expedition 33 - Baguette Trailer (French Cast Reveal) ｜ PS5 Games.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: '46f5cdef-4493-4a35-bb7a-ffaba633cd98',
      label: '720p',
      src: '../../assets/Clair Obscur/720/Clair Obscur： Expedition 33 - Baguette Trailer (French Cast Reveal) ｜ PS5 Games.mp4',
      bitrate: 5000000,
      width: 1280,
      height: 720,
    },
    {
      id: '46f5cdef-4493-4a35-bb7a-ffaba633cd98',
      label: '480p',
      src: '../../assets/Clair Obscur/480/Clair Obscur： Expedition 33 - Baguette Trailer (French Cast Reveal) ｜ PS5 Games.mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '46f5cdef-4493-4a35-bb7a-ffaba633cd98',
      label: '360p',
      src: '../../assets/Clair Obscur/360/Clair Obscur： Expedition 33 - Baguette Trailer (French Cast Reveal) ｜ PS5 Games.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '8f620eb5-3341-43ea-99e3-c4be3de2aa98',
      label: '1080p',
      src: '../../assets/Hades/1080/Hades - v1.0 Launch Trailer.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: '8f620eb5-3341-43ea-99e3-c4be3de2aa98',
      label: '720p',
      src: '../../assets/Hades/720/Hades - v1.0 Launch Trailer.mp4',
      bitrate: 5000000,
      width: 1280,
      height: 720,
    },
    {
      id: '8f620eb5-3341-43ea-99e3-c4be3de2aa98',
      label: '480p',
      src: '../../assets/Hades/480/Hades - v1.0 Launch Trailer.mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '8f620eb5-3341-43ea-99e3-c4be3de2aa98',
      label: '360p',
      src: '../../assets/Hades/360/Hades - v1.0 Launch Trailer.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '69e72246-6a23-4b72-bc88-8ce7adf507ac',
      label: '720p',
      src: '../../assets/Hit workout/720/20 MIN CARDIO HIIT WORKOUT - ALL STANDING - Full Body, No Equipment, No Repeats (1).mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: '69e72246-6a23-4b72-bc88-8ce7adf507ac',
      label: '480p',
      src: '../../assets/Hit workout/480/20 MIN CARDIO HIIT WORKOUT - ALL STANDING - Full Body, No Equipment, No Repeats (1).mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '69e72246-6a23-4b72-bc88-8ce7adf507ac',
      label: '360p',
      src: '../../assets/Hit workout/360/20 MIN CARDIO HIIT WORKOUT - ALL STANDING - Full Body, No Equipment, No Repeats.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '451fb73a-0f0a-4a86-8113-6292307b15dc',
      label: '720p',
      src: '../../assets/Fat Burning Hit Workout/720/20 Min Fat Burning HIIT Workout -  Full body Cardio, No Equipment, No Repeat.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '480p',
      src: '../../assets/Fat Burning Hit Workout/480/20 Min Fat Burning HIIT Workout -  Full body Cardio, No Equipment, No Repeat.mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '360p',
      src: '../../assets/Fat Burning Hit Workout/360/20 Min Fat Burning HIIT Workout -  Full body Cardio, No Equipment, No Repeat.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '1080p',
      src: '../../assets/Dont throw bread side/1080/Dont throw bread sides ｜ 5 minutes healthy bread snacks｜ Quick bread recipe ｜ evening snacks.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '720p',
      src: '../../assets/Dont throw bread side/720/Dont throw bread sides ｜ 5 minutes healthy bread snacks｜ Quick bread recipe ｜ evening snacks.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '480p',
      src: '../../assets/Dont throw bread side/480/Dont throw bread sides ｜ 5 minutes healthy bread snacks｜ Quick bread recipe ｜ evening snacks.mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      label: '360p',
      src: '../../assets/Dont throw bread side/360/Dont throw bread sides ｜ 5 minutes healthy bread snacks｜ Quick bread recipe ｜ evening snacks.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '7dadc7e8-12d1-448f-ab84-68b9d99d2f7b',
      label: '1080p',
      src: '../../assets/Battlefield 1/1080/Battlefield 1 Official Gamescom Trailer.mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: '7dadc7e8-12d1-448f-ab84-68b9d99d2f7b',
      label: '720p',
      src: '../../assets/Battlefield 1/720/Battlefield 1 Official Gamescom Trailer.mp4',
      bitrate: 5000000,
      width: 1280,
      height: 720,
    },
    {
      id: '7dadc7e8-12d1-448f-ab84-68b9d99d2f7b',
      label: '480p',
      src: '../../assets/Battlefield 1/480/Battlefield 1 Official Gamescom Trailer.mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '7dadc7e8-12d1-448f-ab84-68b9d99d2f7b',
      label: '360p',
      src: '../../assets/Battlefield 1/360/Battlefield 1 Official Gamescom Trailer.mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '720p',
      src: '../../assets/Sony FE 16-35mm/720/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 5000000,
      width: 1280,
      height: 720,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '480p',
      src: '../../assets/Sony FE 16-35mm/480/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '360p',
      src: '../../assets/Sony FE 16-35mm/360/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '1080p',
      src: '../../assets/Sony FE 16-35mm/1080/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 8000000,
      width: 1920,
      height: 1080,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '720p',
      src: '../../assets/Sony FE 16-35mm/720/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 5000000,
      width: 1280,
      height: 720,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '480p',
      src: '../../assets/Sony FE 16-35mm/480/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 2000000,
      width: 854,
      height: 480,
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      label: '360p',
      src: '../../assets/Sony FE 16-35mm/360/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      bitrate: 1000000,
      width: 640,
      height: 360,
    },
  ];

  private currentQuality = new BehaviorSubject<VideoQuality>(
    this.getQualities()[1]
  );
  private isAutoQuality = new BehaviorSubject<boolean>(true);
  private availableBandwidth = new BehaviorSubject<number>(0);

  constructor() {}

  getCurrentQuality(): Observable<VideoQuality> {
    return this.currentQuality.asObservable();
  }

  getIsAutoQuality(): Observable<boolean> {
    return this.isAutoQuality.asObservable();
  }

  getQualities(): VideoQuality[] {
    return this.qualities;
  }

  setQuality(quality: VideoQuality): Promise<void> {
    const queryQuality = this.qualities.find(
      (item) => item.id === quality.id && item.src === quality.src
    );
    if (!queryQuality) {
      throw new Error('Quality not found');
    }

    quality = queryQuality;
    return new Promise((resolve) => {
      this.currentQuality.next(quality);
      this.isAutoQuality.next(false);
      resolve();
    });
  }

  setAutoQuality(enable: boolean): void {
    this.isAutoQuality.next(enable);
    if (enable) {
      this.updateQualityBasedOnBandwidth();
    }
  }

  filterQualities(id: string): VideoQuality[] {
    return this.qualities.filter((q) => q.id === id) || [];
  }

  getDefaultQuality(videoId: string): VideoQuality | undefined {
    const qualities = this.filterQualities(videoId);
    return qualities.length > 0 ? qualities[0] : undefined;
  }

  getBestQualityForBandwidth(
    videoId: string,
    bandwidth: number
  ): VideoQuality | undefined {
    const qualities = this.filterQualities(videoId);
    return qualities
      .filter((q) => q.bitrate <= bandwidth * 0.8)
      .sort((a, b) => b.width - a.width)[0];
  }

  updateBandwidth(bandwidth: number): void {
    this.availableBandwidth.next(bandwidth);
    if (this.isAutoQuality.value) {
      this.updateQualityBasedOnBandwidth();
    }
  }

  private updateQualityBasedOnBandwidth(): void {
    const bandwidth = this.availableBandwidth.value;
    const suitable = this.qualities
      .filter((q) => q.bitrate <= bandwidth * 0.8) // 80% del ancho de banda disponible
      .sort((a, b) => b.bitrate - a.bitrate)[0];

    if (suitable && suitable !== this.currentQuality.value) {
      this.currentQuality.next(suitable);
    }
  }
}
