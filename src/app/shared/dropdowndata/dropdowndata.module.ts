import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdowndataComponent } from './dropdowndata.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DropdowndataComponent],
  imports: [CommonModule, NgbDropdownModule],
  exports: [DropdowndataComponent],
})
export class DropdowndataModule {}
