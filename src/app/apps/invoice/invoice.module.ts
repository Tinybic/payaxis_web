import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { NgbDropdownModule, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InvoicelistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvoiceRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbModalModule,
    UiModule,
    SharedModule,
    AvatarModule,
  ]
})
export class InvoiceModule { }
