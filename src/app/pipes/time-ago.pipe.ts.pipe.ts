import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTimeAgoPipeTs',
  standalone: true,
})
export class TimeAgoPipeTsPipe implements PipeTransform {

  transform(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'hace un momento';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 2592000) return `hace ${Math.floor(seconds / 86400)} días`;
    if (seconds < 31536000)
      return `hace ${Math.floor(seconds / 2592000)} meses`;
    return `hace ${Math.floor(seconds / 31536000)} años`;
  }

}
