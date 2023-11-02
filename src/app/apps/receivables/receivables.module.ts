import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './receivable-list/receivable-list.component';
import { ReceivableAddComponent } from './receivable-add/receivable-add.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ReceivableListComponent,
    ReceivableAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReceivablesRoutingModule,
    NgxDropzoneModule,
    NgbDropdownModule,
  ]
})
export class ReceivablesModule { }
