import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent {
  @Input() modalRef;
  @Input() title: string;
  @Input() message: string;
  @Input() btnOK: string;
}
