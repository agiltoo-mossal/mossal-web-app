import { Pipe, PipeTransform } from '@angular/core';
import { getMonthNameFromIndex } from '../../utils/time';

@Pipe({
  name: 'frenchDate',
  standalone: true
})
export class FrenchDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const date = new Date(value);
    return `${date.getDate()} ${getMonthNameFromIndex(date.getMonth())} ${date.getFullYear()}`;
  }

}
