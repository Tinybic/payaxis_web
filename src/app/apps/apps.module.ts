import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsRoutingModule } from './apps-routing.module';
import { JoyrideModule } from 'ngx-joyride';
import { WelcomeComponent } from './welcome/welcome.component';
import { CompanyComponent } from './company/company.component';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTypeaheadModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from '../shared/avatar/avatar.module';

@NgModule({
    declarations: [
        WelcomeComponent,
        CompanyComponent,
    ], imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbNavModule,
        NgbTypeaheadModule,
        AppsRoutingModule,
        NgbDropdownModule,
        NgbProgressbarModule,
        JoyrideModule,
        AvatarModule
    ],
})
export class AppsModule {}
