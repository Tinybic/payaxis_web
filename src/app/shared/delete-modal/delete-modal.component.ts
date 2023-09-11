import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  @Input() modalRef;
  @Input() title;
  @Input() btnDelete;
  @Input() btnCancel;
  @Input() message;
  
  ngOnInit() {
    this.modalRef;
  }
}
