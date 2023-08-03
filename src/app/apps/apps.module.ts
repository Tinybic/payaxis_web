import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CompanyComponent } from './company/company.component';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';
import { AvatarModule } from '../shared/avatar/avatar.module';
import { CostcodeComponent } from './costcode/costcode.component';
import { DropdowndataModule } from '../shared/dropdowndata/dropdowndata.module';

@NgModule({
  declarations: [WelcomeComponent, CompanyComponent, UserWelcomeComponent, CostcodeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTypeaheadModule,
    AppsRoutingModule,
    NgbDropdownModule,
    AvatarModule,
    DropdowndataModule
  ],
})
export class AppsModule {}
