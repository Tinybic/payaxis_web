import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendoraddComponent } from './vendoradd.component';
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorContactsComponent } from "../vendor-contacts/vendor-contacts.component";
import { AddVendorContactComponent } from "../add-vendor-contact/add-vendor-contact.component";


@NgModule({
  declarations: [
    VendoraddComponent,
    VendorContactsComponent,
    AddVendorContactComponent,
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    ReactiveFormsModule
  ],
  exports: [VendoraddComponent]
})
export class VendoraddModule {
}
