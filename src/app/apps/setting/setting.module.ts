import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CostcodeComponent } from './costcode/costcode.component';
import { PaymentComponent } from './payment/payment.component';
import { RolesComponent } from './roles/roles.component';
import { NgbDropdownModule, NgbModalModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { callbackPipeModule } from 'src/app/core/pipe/callback.module';
import { UiModule } from 'src/app/shared/ui/ui.module';



@NgModule({
  declarations: [
    ProfileComponent,
    CostcodeComponent,
    PaymentComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTypeaheadModule,
    NgbModalModule,
    NgbDropdownModule,
    AvatarModule,
    SettingRoutingModule,
    callbackPipeModule,
    UiModule
  ]
})
export class SettingModule { }
