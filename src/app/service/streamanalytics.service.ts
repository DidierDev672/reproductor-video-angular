import { Injectable } from '@angular/core';

interface StreamingMetrics {
  bandwidth: number;
  bufferLength: number;
  droppedFrames: number;
  currentQuality: string;
  latency: number;
  timestamp: number;
}


@Injectable({
  providedIn: 'root'
})
export class StreamanalyticsService {
  private metrics: StreamingMetrics[] = [];

  logMetric(metrics: StreamingMetrics) {
    const metricWithTimestamp = {
      ...metrics,
      timestamp: Date.now()
    };
    this.metrics.push(metricWithTimestamp);

  }

  constructor() { }

  getAverageMetrics(timeWindow: number = 60000) { // último minuto.
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => now - m.timestamp < timeWindow
    );

    // Calcular promedios
    return {
      bandwidth: this.average(recentMetrics.map(m => m.bandwidth)),
      bufferLength: this.average(recentMetrics.map(m => m.bufferLength)),
      droppedFrames: this.average(recentMetrics.map(m => m.droppedFrames)),
      latency: this.average(recentMetrics.map(m => m.latency)),
    }

  }

  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

}
