import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackPipe } from "../core/pipe/callback.pipe";
import { CheckProjectStatusPipe } from "../core/pipe/checkProjectStatus";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { UploadAttachmentComponent } from "./upload-attachment/upload-attachment.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { UiModule } from "./ui/ui.module";
import { NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    CallbackPipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent,
    UploadAttachmentComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    UiModule,
    NgbProgressbarModule,
  ],
  exports: [
    CallbackPipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent,
    UploadAttachmentComponent
  ]
})
export class SharedModule { }
