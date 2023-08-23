import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  constructor() { }
  
  
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  
  onSort(array, sortCloumn, direction) {
    if (direction == 'desc') {
      direction = 'asc';
    } else {
      direction = 'desc';
    }
  
    let newArray =  [...array].sort((a, b) => {
      const res = this.compare(a[sortCloumn], b[sortCloumn]);
      return direction === 'asc' ? res : -res;
    });
    
    return {newArray, direction};
  }
}
