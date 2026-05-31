import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(array: any[], args?: any): any[] {
    if (!array) return [];
    if (!args || !args.property || !args.order) return array;
    return [...array].sort((a, b) => {
      if (a[args.property] < b[args.property]) {
        return -1 * args.order;
      } else if (a[args.property] > b[args.property]) {
        return 1 * args.order;
      }
      return 0;
    });
  }
}
