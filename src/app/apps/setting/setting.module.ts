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
import { UiModule } from 'src/app/shared/ui/ui.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { AddRoleComponent } from './add-role/add-role.component';
import { SharedModule } from "../../shared/shared.module";
import { SimplebarAngularModule } from "simplebar-angular";
import { AddCostcodeComponent } from './add-costcode/add-costcode.component';
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { UserSignatureComponent } from './user-signature/user-signature.component';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { MyprofileComponent } from './myprofile/myprofile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    CostcodeComponent,
    PaymentComponent,
    RolesComponent,
    AddRoleComponent,
    AddCostcodeComponent,
    UserSignatureComponent,
    MyprofileComponent,
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
    UiModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SimplebarAngularModule,
    NgxPlaidLinkModule,
    AngularSignaturePadModule
  ],
  providers:[
    provideNgxMask()
  ],
  exports: [
    AddCostcodeComponent,
  ]
})
export class SettingModule { }
