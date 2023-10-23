import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { FormsModule } from '@angular/forms';
import { VendorRoutingModule } from './vendor-routing.module';
import { NgbDropdownModule,  NgbModalModule, NgbNavModule,  NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { VendoraddModule } from './vendoradd/vendoradd.module';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { TagInputModule } from 'ngx-chips';
import { VendorInviteComponent } from './vendor-invite/vendor-invite.component';


@NgModule({
  declarations: [
    VendorlistComponent,
    VendorInviteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    TagInputModule,
    VendorRoutingModule,
    NgbDropdownModule,
    NgbModalModule,
    VendoraddModule,
    UiModule,
    SharedModule,
    AvatarModule,
    NgbTooltipModule
  ]
})
export class VendorModule { }
