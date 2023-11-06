import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companypayment_list } from 'src/app/core/gql/payment';
import { projectpayment_list } from 'src/app/core/gql/receivables';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.scss'],
})
export class ReceivableListComponent {
  @ViewChild('addModal') addModal: any;

  filterList = [];
  loading = true;
  paymentRequestList = [];
  PAYMENTREQUESTLIST = [];
  direction = 'asc';
  sortColumn = '';
  keywords = '';
  paymentTypeFilter = 'Payment type';
  dueDateFilter = 'Due date';
  projectFilter = 'Project';
  statusFilter = 'All';
  projects = [];
  vendorList = [];
  paymentList = [];
  vendorFilter = 'Vendor';
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getList();
    this.getVendorList();
    this.getPaymentList();
  }

  getVendorList() {
    this.apolloService
      .query(vendor_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.vendor_list;
        if (!result.error) {
          this.vendorList = result.data;
        }
      });
  }

  getPaymentList() {
    this.apolloService
      .query(companypayment_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companypayment_list;
        if (!result.error) {
          this.paymentList = result.data;
          this.paymentList.forEach((item) => {
            if (item.account.length > 4)
              item.account = item.account.substring(item.account.length - 4);
          });
        }
      });
  }

  filterVendorList(vendorName) {
    this.vendorFilter = vendorName;
    this.paymentRequestList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    if (vendorName != 'All') {
      this.paymentRequestList = this.paymentRequestList.filter((item) =>
        item.vendorName.toLowerCase().includes(vendorName.toLowerCase())
      );
    }
  }

  onSort(item) {}
  filterTable = (request: any) => {
    let values = Object.values(request);
    return values.some(
      (v) =>
        request.vendorName
          .toLowerCase()
          .includes(this.keywords.toLowerCase()) ||
        request.billNumber
          .toString()
          .toLowerCase()
          .includes(this.keywords.toLowerCase()) ||
        request.orderNumber
          .toString()
          .toLowerCase()
          .includes(this.keywords.toLowerCase())
    );
  };

  filterListStatus(status) {
    this.statusFilter = status;
    this.paymentRequestList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    if (status != 'All') {
      this.paymentRequestList = this.paymentRequestList.filter(
        (item) => item.status.toLowerCase() == status.toLowerCase()
      );
    }
  }

  paymentTypeFilterList(id, payment) {
    console.log(payment);
    this.paymentTypeFilter = payment;
    this.paymentRequestList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    if (payment != 'All') {
      this.paymentRequestList = this.paymentRequestList.filter(
        (item) => item.account.toLowerCase() == payment.toLowerCase()
      );
    } 
  }

  getList() {
    this.apolloService
      .query(projectpayment_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: 0,
        idVendor: 0,
      })
      .then((res) => {
        const result = res.projectpayment_list;
        this.paymentRequestList = result.data;

        this.paymentRequestList.forEach((item) => {
          if (item.account.length > 4)
            item.account = 'ACH * ' + item.account.substring(item.account.length - 4);
          else{
            item.account = 'ACH * ' + item.account;
          }
        });
        this.PAYMENTREQUESTLIST = JSON.parse(JSON.stringify(this.paymentRequestList));
        this.loading = false;
      });
  }

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

  openEditModal(id) {}
}
