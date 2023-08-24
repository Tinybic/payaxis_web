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
  VENDOR_LIST = [];
  idvendor = 0;
  loading = true;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getVendorList();
  }

  getVendorList() {
    if (parseInt(localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(vendor_list, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
        })
        .then((res) => {
          const result = res.vendor_list;

          if (!result.error) {
            this.vendorlist = result.data;
            this.VENDOR_LIST = JSON.parse(JSON.stringify(result.data));
          }
          this.loading = false;
        });
    }
  }

  searchTable() {
    this.vendorlist = this.VENDOR_LIST;
    this.vendorlist = this.vendorlist.filter((vendor) =>
      vendor.vendorName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  }
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  onSort(column) {
    this.sortCloumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.vendorlist = [...this.vendorlist].sort((a, b) => {
      const res = this.compare(a[this.sortCloumn], b[this.sortCloumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }
  modalRef;
  openAddModal() {
    this.idvendor = 0;
    this.modalRef = this.modalService.open(this.inviteVendor, {
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true,
    });

    this.modalRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
  }

  openEditModal(id) {
    this.idvendor = id;
    this.modalRef = this.modalService.open(this.inviteVendor, {
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true,
    });

    this.modalRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
  }
}
