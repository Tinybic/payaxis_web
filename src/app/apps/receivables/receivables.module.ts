import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './receivable-list/receivable-list.component';
import { ReceivableAddComponent } from './receivable-add/receivable-add.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    ReceivableListComponent,
    ReceivableAddComponent
  ],
  imports: [
    CommonModule,
    ReceivablesRoutingModule,
    NgxDropzoneModule,
  ]
})
export class ReceivablesModule { }
