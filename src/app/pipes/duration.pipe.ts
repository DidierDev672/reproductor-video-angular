import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDuration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {

  transform(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

}
