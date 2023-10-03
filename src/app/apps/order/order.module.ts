import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../shared/shared.module";
import { AvatarModule } from "../../shared/avatar/avatar.module";
import { DropdowndataModule } from "../../shared/dropdowndata/dropdowndata.module";
import { UiModule } from "../../shared/ui/ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    NgbDropdownModule,
    DropdowndataModule,
    AvatarModule,
    UiModule,
    SharedModule,
  ]
})
export class OrderModule { }
