import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public baseUrl = 'https://payaxis.azurewebsites.net/';
  constructor(public http: HttpClient) { }
  

  post(api: any, obj: any): any {
    const htttpOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json'})
    };
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + api, obj, htttpOptions).subscribe({
        next(res): any {
          resolve(res);
        },
        error(err): any {
          reject(err);
        }
      });
    });
  }
}
