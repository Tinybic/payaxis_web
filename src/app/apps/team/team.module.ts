import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamlistComponent } from './teamlist/teamlist.component';
import { TeamRoutingModule } from './team-routing.module';



@NgModule({
  declarations: [
    TeamlistComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule
  ]
})
export class TeamModule { }
