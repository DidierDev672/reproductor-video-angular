import { Injectable } from '@angular/core';
import { VideoQuality } from '../domain/video-quality.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoBufferService {
  private bufferCache: Map<string, ArrayBuffer> = new Map();

  async preloadQuality(quality: VideoQuality): Promise<void>{
    if (this.bufferCache.has(quality.src)) return;

    try {
      const response = await fetch(quality.src);
      const buffer = await response.arrayBuffer();
      this.bufferCache.set(quality.src, buffer);
    } catch (error) {
      console.error(`Error al cargar la calidad:`, error);
    }
  }

  getBuffer(src: string): ArrayBuffer | undefined {
    return this.bufferCache.get(src);
  }


  clearBuffer(src: string): void {
    this.bufferCache.delete(src);
  }

}
