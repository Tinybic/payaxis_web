import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackPipe } from "../core/pipe/callback.pipe";
import { CheckProjectStatusPipe } from "../core/pipe/checkProjectStatus";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";


@NgModule({
  declarations: [
    CallbackPipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CallbackPipe,
    CheckProjectStatusPipe,
    ConfirmModalComponent
  ]
})
export class SharedModule { }
