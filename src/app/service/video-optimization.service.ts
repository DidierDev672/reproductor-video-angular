import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoOptimizationService {
  private offscreenCanvas: OffscreenCanvas | null = null;

  constructor() {
    // Verificar soporte para OffscreenCanvas.
    if (typeof OffscreenCanvas !== 'undefined') {
      this.offscreenCanvas = new OffscreenCanvas(1, 1);
    }
  }

  optimizeFrame(
    sourceCanvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    if (this.offscreenCanvas) {
      return this.optimizeWithOffscreen(
        sourceCanvas,
        targetWidth,
        targetHeight
      );
    } else {
      return this.optimizeWithRegularCanvas(
        sourceCanvas,
        targetWidth,
        targetHeight
      );
    }
  }

  private optimizeWithOffscreen(
    sourceCanvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    const ctx = this.offscreenCanvas!.getContext('2d')!;

    // Configurar dimensiones.
    this.offscreenCanvas!.width = targetWidth;
    this.offscreenCanvas!.height = targetHeight;

    // Aplicar optimizaciones.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Dibujar y obtener datos.
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  }

  private optimizeWithRegularCanvas(
    sourceCanvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d')!;

    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  }
}
