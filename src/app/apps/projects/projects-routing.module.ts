import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsGuidComponent } from "./projects-guid/projects-guid.component";

const routes: Routes = [{
    path: '',
    component: ProjectsComponent
},{
    path: 'projects-guid',
    component: ProjectsGuidComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
