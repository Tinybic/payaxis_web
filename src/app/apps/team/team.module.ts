import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamlistComponent } from './teamlist/teamlist.component';
import { TeamRoutingModule } from './team-routing.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    TeamlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TeamRoutingModule,
    NgbDropdownModule,
    SweetAlert2Module,
  ]
})
export class TeamModule { }
