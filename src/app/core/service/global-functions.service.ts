import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  private companyID = new BehaviorSubject<string>('')
  companyID$ = this.companyID.asObservable();

  constructor() { }
  
  private set setCompanyID(id: string){
    this.companyID.next(id);
  }
  
  private get getCompanyID(): string{
    return this.companyID.getValue();
  }
  
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
