import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FILE_TYPE, IMG_TYPE } from "../constants/common";
import { FileSaverService } from "ngx-filesaver";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  private companyID = new BehaviorSubject<number>(0)
  companyID$ = this.companyID.asObservable();
  
  setCompanyID(id: number){
    this.companyID.next(id);
  }
  
  constructor(
    private fileSaverService: FileSaverService,
    private http: HttpClient,
  ){ }
  
  compare(v1: string | number, v2: string | number): any{
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  
  onSort(array, sortColumn, direction){
    if(direction == 'desc'){
      direction = 'asc';
    } else{
      direction = 'desc';
    }
    
    let newArray = [...array].sort((a, b) => {
      const res = this.compare(a[sortColumn], b[sortColumn]);
      return direction === 'asc' ? res : -res;
    });
    
    return {
      newArray,
      direction
    };
  }
  
  /**
   * Filters the value of the item
   * @param item object
   * @param attrs attribute array
   * @param key search/filter key
   */
  filterValue(item, attrs, key){
    return attrs.some((attr) => {
      if(item[attr] && item[attr].toString().toLowerCase().includes(key.toLowerCase())){
        return true;
      }
      return false;
    });
  }
  
  
  /**
   * Formats file size
   */
  getSize(f: File){
    const bytes = f.size;
    if(bytes === 0){
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes',
      'KB',
      'MB',
      'GB',
      'TB',
      'PB',
      'EB',
      'ZB',
      'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  getFileImg(file){
    if(IMG_TYPE.includes(file.fileType.toLowerCase())){
      return file.fileUrl;
    }
    if(FILE_TYPE.includes(file.fileType.toLowerCase())){
      return 'assets/images/icon/' + file.fileType.toLowerCase() + '.png';
    } else{
      return 'assets/images/icon/zz.png';
    }
  }
  
  
  /*
  * object need fileUrl and fileName properties;
  * */
  downloadFile(attachment){
    this.http.get(attachment.fileUrl, {
      observe: 'response',
      responseType: 'blob',
    }).subscribe(res => {
      this.fileSaverService.save((<any>res).body, attachment.fileName);
    });
  }
  
  /**
   * 将字符串改为驼峰格式字符串
   * @param str
   */
  toCamelCase(str: string): string {
    return str.replace(/[-_ ](\w)/g, (_, c) => c.toUpperCase());
  }
  
  /**
   * Active 不属于 status，这是为了使用方便添加
   * Active 表示除 Paid 之外的其他状态
   */
  POStatusCount={
    Active: 0,
    Draft: 0,
    Pending: 0,
    Accepted: 0,
    'Partially paid': 0,
    Declined: 0,
    Paid: 0,
    // Voided: 0,
  }
  
  /**
   * Active 不属于 status，这是为了使用方便添加
   * Active 表示除 Paid 之外的其他状态
   */
  BillStatusCount={
    Active: 0,
    'Payment Requested': 0,
    Approved: 0,
    Declined: 0,
    Paid: 0,
  }
  
}
