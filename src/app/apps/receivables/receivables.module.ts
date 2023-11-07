import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './receivable-list/receivable-list.component';
import { ReceivableAddComponent } from './receivable-add/receivable-add.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiModule } from 'src/app/shared/ui/ui.module';


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
    NgbDatepickerModule,
    UiModule,
    SharedModule,
  ]
})
export class ReceivablesModule { }
