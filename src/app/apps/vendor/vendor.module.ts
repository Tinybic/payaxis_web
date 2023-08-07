import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { FormsModule } from '@angular/forms';
import { VendorRoutingModule } from './vendor-routing.module';
import { NgbDropdownModule,  NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { VendoraddModule } from './vendoradd/vendoradd.module';

@NgModule({
  declarations: [
    VendorlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    VendorRoutingModule,
    NgbDropdownModule,
    NgbModalModule,
    VendoraddModule
  ]
})
export class VendorModule { }
