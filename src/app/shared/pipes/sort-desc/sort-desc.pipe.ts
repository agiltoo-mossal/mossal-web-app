import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDesc',
  standalone: true
})
export class SortDescPipe implements PipeTransform {

  transform(value: any[], key: string): any[] {
    if (!value) return [];
    if (!key) return value;

    return value.sort((a, b) => {
      if (a[key] < b[key]) {
        return 1;
      } else if (a[key] > b[key]) {
        return -1;
      } else {
        return 0;
      }
    });
  }

}
