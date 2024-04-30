import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'propertyMatch',
  standalone: true
})
export class PropertyMatchPipe implements PipeTransform {

  transform(items: any[], propertyName: string, propertyValue: any): any[] {
    console.log({items, propertyName})
    if (!items) return [];
    if (!propertyName) return items;
    if(!propertyValue) return items;

    return items.filter(item => item[propertyName] == propertyValue);
  }

}
