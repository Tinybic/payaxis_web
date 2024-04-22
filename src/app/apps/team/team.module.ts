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
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamDetailComponent } from './team-detail/team-detail.component';
@NgModule({
  declarations: [TeamlistComponent, TeamDetailComponent],
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
    UiModule,
    SharedModule,
  ],
})
export class TeamModule {}
