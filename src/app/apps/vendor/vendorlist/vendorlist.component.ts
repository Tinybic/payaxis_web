import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss'],
})
export class VendorlistComponent {
  @ViewChild('inviteVendor') inviteVendor: any;

  keywords = '';
  direction = '';
  sortCloumn = '';
  vendorlist = [];

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getVendorList();
  }

  getVendorList() {
    ;
    if (parseInt(localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(vendor_list, { idCompany: parseInt(localStorage.getItem('idcompany')) })
        .then((res) => {
          const result = res.vendor_list;
          if (!result.error) {
            this.vendorlist = result.data;
          }
        });
    }
  }


  searchTable() {}

  onSort(column) {}

  openAddModal() {
    this.modalService.open(this.inviteVendor, {
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true,
    });
  }
}
