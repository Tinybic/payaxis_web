import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { VerticalLayoutComponent } from './layout/layout.component';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
  declarations: [
    VerticalLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SimplebarAngularModule
  ],
  exports: [
    VerticalLayoutComponent
  ]
})
export class VerticalModule { }
