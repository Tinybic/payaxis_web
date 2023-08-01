import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { CompanyComponent } from './company/company.component';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';
import { UserWelcomeGuidComponent } from "./user-welcome-guid/user-welcome-guid.component";

const routes: Routes = [
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'team', loadChildren: () => import('./team/team.module').then(m => m.TeamModule) },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'user-welcome',
    component: UserWelcomeComponent
  },
  {
    path: 'user-welcome-guid',
    component: UserWelcomeGuidComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule { }
