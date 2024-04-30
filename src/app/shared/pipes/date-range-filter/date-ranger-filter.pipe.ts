import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRangeFilter',
  standalone: true
})
export class DateRangerFilterPipe implements PipeTransform {

  transform(items: any[], propertyName: string, startDate: string, endDate: string): any[] {
    if (!items) return [];
    if (!propertyName || !startDate || !endDate) return items;

    return items.filter(item => {
      const itemDate = new Date(item[propertyName]);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  }

}
