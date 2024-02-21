import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], search: string, property?: string): any {
    if(!value) {
      return value;
    }
    else if(property) {
      return value.filter(item => {
        const val = JSON.stringify({ v: item[property] }).toLowerCase();
        return val.includes(search.toLowerCase());
      });
    }
    else {
      return value.filter(item => {
        const val = JSON.stringify({ v: item }).toLowerCase();
        return val.includes(search.toLowerCase());
      })
    }
  }

}
