import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback',
  pure: false
})
export class CallbackPipe implements PipeTransform {
  transform(items: any[], callback: (item: any, i?: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter((item, i) => callback(item, i));
  }
}
