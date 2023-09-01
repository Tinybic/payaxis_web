import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'checkProjectStatus',
  pure: false
})

export class CheckProjectStatusPipe implements PipeTransform {
  transform(arr: any[]){
    return arr.some(item => {
      return item.idCategory !== '';
    })
  }
}
