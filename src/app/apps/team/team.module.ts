import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamlistComponent } from './teamlist/teamlist.component';
import { TeamRoutingModule } from './team-routing.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { DropdowndataModule } from 'src/app/shared/dropdowndata/dropdowndata.module';
import { TagInputModule } from 'ngx-chips'; // this is needed
@NgModule({
  declarations: [TeamlistComponent],
  imports: [
    CommonModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    TeamRoutingModule,
    NgbDropdownModule,
    SweetAlert2Module,
    AvatarModule,
    DropdowndataModule,
  ],
})
export class TeamModule {}
