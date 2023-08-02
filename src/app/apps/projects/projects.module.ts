import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import {
    NgbTooltipModule,
    NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectsGuidComponent } from './projects-guid/projects-guid.component';


@NgModule({
    declarations: [
        ProjectsComponent,
        ProjectsGuidComponent
    ],
    imports: [
        CommonModule,
        NgbTooltipModule,
        ProjectsRoutingModule,
        NgbProgressbarModule
    ]
})
export class ProjectsModule { }
