import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {
  NgbAlertModule,
  NgbTooltipModule,
  NgbProgressbarModule, NgbDropdownModule, NgbNavModule, NgbDatepickerModule
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsGuidComponent } from './projects-guid/projects-guid.component';
import { CreateProjectComponent } from "./create-project/create-project.component";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { SharedModule } from "../../shared/shared.module";
import { UiModule } from "../../shared/ui/ui.module";
import { CreateGroupComponent } from './create-group/create-group.component';
import { SetColorComponent } from './set-color/set-color.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { InfoModalComponent } from "../../shared/info-modal/info-modal.component";
import { ProjectTeamComponent } from './project-team/project-team.component';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { DropdowndataModule } from 'src/app/shared/dropdowndata/dropdowndata.module';
import { TagInputModule } from 'ngx-chips';
import { ProjectOrdersComponent } from './project-orders/project-orders.component';
import { SimplebarAngularModule } from "simplebar-angular";
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { MomentModule } from "ngx-moment";
import { CsvModule } from "@ctrl/ngx-csv";
import { ProjectVendorComponent } from './project-vendor/project-vendor.component';
import { VendoraddModule } from '../vendor/vendoradd/vendoradd.module';
import { VendorModule } from '../vendor/vendor.module';
import { SettingModule } from "../setting/setting.module";


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsGuidComponent,
    CreateProjectComponent,
    CreateBudgetComponent,
    CreateGroupComponent,
    SetColorComponent,
    ProjectDetailComponent,
    InfoModalComponent,
    ProjectTeamComponent,
    ProjectOrdersComponent,
    BudgetDetailComponent,
    PaymentHistoryComponent,
    ProjectVendorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbDropdownModule,
    ProjectsRoutingModule,
    NgbProgressbarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule,
    UiModule,
    NgbNavModule,
    AvatarModule,
    DropdowndataModule,
    TagInputModule,
    SimplebarAngularModule,
    NgbDatepickerModule,
    MomentModule,
    CsvModule,
    VendoraddModule,
    VendorModule,
    SettingModule
  ],
  providers:[
    provideNgxMask()
  ],
  exports:[
    CreateProjectComponent
  ]
})
export class ProjectsModule {
}
