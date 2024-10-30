import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BandwidthDetectorService {
  private readonly SAMPLE_SIZE = 2000000; // 2MB
  private readonly TEST_URL = 'path/to/bandwidth/test/file';


  async measureBandwidth(): Promise<number> {
    const startTime = performance.now();

    try {
      const response = await fetch(this.TEST_URL, {
        headers: { Range: `bytes=0-${this.SAMPLE_SIZE}` }
      });

      await response.arrayBuffer();
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // segundos
      const bitsLoaded = this.SAMPLE_SIZE * 8;

      return bitsLoaded / duration; // bits por segundo.
    } catch (error) {
      console.error('Error al medir el ancho de banda:', error);
      return 0;
    }
  }

}
