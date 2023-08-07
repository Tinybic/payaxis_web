import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendoraddComponent } from './vendoradd.component';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VendoraddComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbTypeaheadModule,
  ],
  exports: [VendoraddComponent],
})
export class VendoraddModule {}
