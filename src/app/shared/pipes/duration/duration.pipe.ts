import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const months = Math.floor(minutes / (30 * 24 * 60)); // Approximation
    const days = Math.floor((minutes % (30 * 24 * 60)) / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;

    let result = '';
    if (months > 0) {
      result += `${months} mois `;
    }
    if (days > 0) {
      result += `${days} jours `;
    }
    if (hours > 0) {
      result += `${hours} heures `;
    }
    if (remainingMinutes > 0) {
      result += `${remainingMinutes} minutes`;
    }

    return result.trim(); // Pour éliminer les espaces inutiles
  }
}
``
