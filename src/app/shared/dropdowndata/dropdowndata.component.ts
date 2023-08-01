import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropDwonItem } from 'src/app/core/constants/members';

@Component({
  selector: 'app-dropdowndata',
  templateUrl: './dropdowndata.component.html',
  styleUrls: ['./dropdowndata.component.scss'],
})
export class DropdowndataComponent {
  @Input() displayText: string = '';
  @Input() data = [];
  @Input() color = 'text-black';
  @Output() selectValue = new EventEmitter<DropDwonItem>();

  changeStatus(id, text) {
    this.displayText = text;
    this.selectValue.emit({ id: id, text: text });
  }
}
