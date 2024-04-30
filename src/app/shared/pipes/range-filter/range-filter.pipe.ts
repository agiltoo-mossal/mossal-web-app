import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rangeFilter',
  standalone: true
})
export class RangeFilterPipe implements PipeTransform {

  transform(items: any[], propertyName: string, min: number, max: number): any[] {
    if (!items) return [];
    if (!propertyName || min === undefined || max === undefined) return items;

    return items.filter(item => {
      const value = item[propertyName];
      return value >= min && value <= max;
    });
  }

}
