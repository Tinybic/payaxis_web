import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsGuidComponent } from "./projects-guid/projects-guid.component";
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const routes: Routes = [{
    path: '',
    component: ProjectsComponent
},{
    path: 'guid',
    component: ProjectsGuidComponent
},{
    path: 'detail/:id',
    component: ProjectDetailComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
