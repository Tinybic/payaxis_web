import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {
  NgbAlertModule,
  NgbTooltipModule,
  NgbProgressbarModule, NgbDropdownModule, NgbNavModule
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
import { DeleteModalComponent } from "../../shared/delete-modal/delete-modal.component";
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { InfoModalComponent } from "../../shared/info-modal/info-modal.component";


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsGuidComponent,
    CreateProjectComponent,
    CreateBudgetComponent,
    CreateGroupComponent,
    SetColorComponent,
    DeleteModalComponent,
    ProjectDetailComponent,
    InfoModalComponent
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
    NgbNavModule
  ],
  providers:[
    provideNgxMask()
  ]
})
export class ProjectsModule {
}
