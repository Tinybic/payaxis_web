import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbAlertModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgClickOutsideModule } from 'ng-click-outside2';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FooterComponent } from './footer/footer.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';

@NgModule({
  declarations: [
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgClickOutsideModule,
    SimplebarAngularModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbAlertModule,
    AvatarModule
  ],
  exports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
