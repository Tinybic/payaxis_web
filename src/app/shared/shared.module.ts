import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackPipe } from "../core/pipe/callback.pipe";
import { CheckProjectStatusPipe } from "../core/pipe/checkProjectStatus";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { UploadAttachmentComponent } from "./upload-attachment/upload-attachment.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { UiModule } from "./ui/ui.module";
import { SafePipe } from '../core/pipe/safe.pipe';
import { PayingBillComponent } from "../apps/invoice/paying-bill/paying-bill.component";
import { NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";



@NgModule({
  declarations: [
    CallbackPipe,
    SafePipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent,
    UploadAttachmentComponent,
    PayingBillComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    UiModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers:[
    provideNgxMask()
  ],
  exports: [
    CallbackPipe,
    SafePipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent,
    UploadAttachmentComponent,
    PayingBillComponent,
  ]
})
export class SharedModule { }
