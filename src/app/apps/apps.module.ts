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

@NgModule({
  declarations: [WelcomeComponent, CompanyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTypeaheadModule,
    AppsRoutingModule,
    NgbDropdownModule,
  ],
})
export class AppsModule {}
