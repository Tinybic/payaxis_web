import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CompanyComponent } from './company/company.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    WelcomeComponent,
    CompanyComponent
  ],
  imports: [CommonModule, AppsRoutingModule,NgbNavModule],
})
export class AppsModule { }
