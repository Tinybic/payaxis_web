import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMG_TYPE } from "../constants/common";

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  private companyID = new BehaviorSubject<number>(0)
  companyID$ = this.companyID.asObservable();
  
  setCompanyID(id: number){
    this.companyID.next(id);
  }

  constructor() { }
  
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  
  onSort(array, sortColumn, direction) {
    if (direction == 'desc') {
      direction = 'asc';
    } else {
      direction = 'desc';
    }
  
    let newArray =  [...array].sort((a, b) => {
      const res = this.compare(a[sortColumn], b[sortColumn]);
      return direction === 'asc' ? res : -res;
    });
    
    return {newArray, direction};
  }
  
  
  /**
   * Formats file size
   */
  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  getFileImg(file){
    if(IMG_TYPE.includes(file.fileType.toLowerCase())){
      return file.fileUrl;
    } else{
      return 'assets/images/icon/' + file.fileType + '.png';
    }
  }
}
