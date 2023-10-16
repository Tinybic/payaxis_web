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
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from "../../../shared/shared.module";
import { VendorOrderComponent } from '../vendor-order/vendor-order.component';
import { VendorPaymentComponent } from '../vendor-payment/vendor-payment.component';
import { UploadAttachmentComponent } from "../upload-attachment/upload-attachment.component";
import { NgxDropzoneModule } from "ngx-dropzone";

@NgModule({
  declarations: [
    VendoraddComponent,
    VendorContactsComponent,
    AddVendorContactComponent,
    VendorOrderComponent,
    VendorPaymentComponent,
    UploadAttachmentComponent,
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    NgbNavModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule,
    UiModule,
    NgxDropzoneModule,
  ],
  exports: [VendoraddComponent],
  providers:[
    provideNgxMask()
  ]
})
export class VendoraddModule {
}
