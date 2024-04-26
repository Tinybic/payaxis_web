import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../service/http.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private httpSerivce: HttpService, private router:Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          if (localStorage.getItem('refreshToken')) {
            this.httpSerivce
              .post('newtoken', {
                refreshToken: localStorage.getItem('refreshToken'),
              })
              .then((res) => {
                if (!res.error) {
                  localStorage.setItem('refreshToken', res.data.refreshToken);
                  localStorage.setItem('token', res.data.token);
                  location.reload();
                } else {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshtoken');
                  this.router.navigate(['auth/login'])
                }
                
              })
              .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshtoken');
                this.router.navigate(['auth/login'])
              });
          } 
          else{
            this.router.navigate(['auth/login'])
          }
          
        }
        if (err.status === 502) {
          location.reload();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
