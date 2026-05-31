import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if (!items) return [];
    if (!terms) return items;
    return items.filter((it) => it.course && it.course.includes(terms));
  }
}
