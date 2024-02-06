import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { SafePipe } from './pipe/safe.pipe';

@NgModule({
  declarations: [
  ],
  imports: [CommonModule],
  providers: [
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
})
export class CoreModule {}
