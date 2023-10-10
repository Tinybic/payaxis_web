import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { FormsModule } from '@angular/forms';
import { VendorRoutingModule } from './vendor-routing.module';
import { NgbDropdownModule,  NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { VendoraddModule } from './vendoradd/vendoradd.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VendorlistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    VendorRoutingModule,
    NgbDropdownModule,
    NgbModalModule,
    VendoraddModule,
    UiModule,
    SharedModule
  ]
})
export class VendorModule { }
