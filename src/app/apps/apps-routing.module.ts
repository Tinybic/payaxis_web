import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'team', loadChildren: () => import('./team/team.module').then(m => m.TeamModule) },
  { path: 'vendor', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule) },
  { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
  { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
  {
    path: 'welcome',
    component: WelcomeComponent
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
