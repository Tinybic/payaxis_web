import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { NgbDropdownModule,  NgbModalModule,  NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../shared/shared.module";
import { AvatarModule } from "../../shared/avatar/avatar.module";
import { DropdowndataModule } from "../../shared/dropdowndata/dropdowndata.module";
import { UiModule } from "../../shared/ui/ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddOrderComponent } from './add-order/add-order.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { ActivityComponent } from './activity/activity.component';



@NgModule({
  declarations: [
    OrderComponent,
    AddOrderComponent,
    AttachmentsComponent,
    ActivityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    NgbDropdownModule,
    DropdowndataModule,
    AvatarModule,
    NgbDropdownModule,
    NgbModalModule,
    UiModule,
    SharedModule
  ]
})
export class OrderModule { }
