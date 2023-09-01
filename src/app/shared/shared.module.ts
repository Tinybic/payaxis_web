import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackPipe } from "../core/pipe/callback.pipe";
import { CheckProjectStatusPipe } from "../core/pipe/checkProjectStatus";



@NgModule({
  declarations: [
    CallbackPipe,
    CheckProjectStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CallbackPipe,
    CheckProjectStatusPipe
  ]
})
export class SharedModule { }
