import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent {
  @Input() params;
  @Input() modalRef;
}
