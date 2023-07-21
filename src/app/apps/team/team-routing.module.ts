import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamlistComponent } from './teamlist/teamlist.component';

const routes: Routes = [{ path: '', component: TeamlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
