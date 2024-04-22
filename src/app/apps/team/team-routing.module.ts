import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamlistComponent } from './teamlist/teamlist.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';

const routes: Routes = [{ path: '', component: TeamlistComponent },{ path: 'detail/:id', component: TeamDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
