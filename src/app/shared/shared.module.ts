import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackPipe } from "../core/pipe/callback.pipe";



@NgModule({
  declarations: [
    CallbackPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CallbackPipe
  ]
})
export class SharedModule { }
