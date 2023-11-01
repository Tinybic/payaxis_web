import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.scss'],
})
export class ReceivableListComponent {
  @ViewChild('addModal') addModal: any;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  addModalRef;
  openAddModal() {
    this.addModalRef = this.modalService.open(this.addModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '640',
    });
    this.addModalRef.result.then(
      (res) => {
        this.addModalRef = null;
      },
      (dismiss) => {
        this.addModalRef = null;
      }
    );
  }
}
