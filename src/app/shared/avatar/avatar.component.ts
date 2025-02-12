import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() url: string = '';
  @Input() size: number = 32;
  @Input() zindex: number = 1;
  @Input() bgColor: string = 'bg-white';
  @Input() companyName: string = '';
  @Input() color: string = 'text-primary';
  @Input() radius: number = 32;
  companyNameText = '';
  constructor() {}

  ngOnInit() {
    const company = this.companyName.split(' ');
    if (company.length == 1) {
      this.companyNameText = company[0].substring(0, 1);
    } else if (company.length > 1) {
      this.companyNameText =
        company[0].substring(0, 1) + company[1].substring(0, 1);
    }
    if (this.url.length > 0) {
      this.bgColor = '';
    }
  }
}
