import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsGuidComponent } from "./projects-guid/projects-guid.component";
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { BudgetDetailComponent } from "./budget-detail/budget-detail.component";

const routes: Routes = [{
    path: '',
    component: ProjectsComponent
},{
    path: 'guid',
    component: ProjectsGuidComponent
},{
    path: 'detail/:id',
    component: ProjectDetailComponent
},{
  path: 'team/:id',
  component: ProjectTeamComponent
},{
  path: 'budget-detail',
  component: BudgetDetailComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
