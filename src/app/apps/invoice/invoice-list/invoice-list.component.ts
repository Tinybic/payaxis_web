import { Component, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companypayment_list } from 'src/app/core/gql/payment';
import { projectbill_list } from 'src/app/core/gql/receivables';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent {
  @ViewChild('addModal') addModal: any;
  @ViewChild('payingBill') payingBillModal: NgbModalRef;
  
  addModalRef;
  payingBillModalRef: NgbModalRef;
  invoiceList = [];
  INVOICELIST = [];
  filterList = [];
  loading = true;
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

  selectedDateRange: string = 'Due date';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.getList();
    this.getVendorList();
    this.getPaymentList();

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.selectedDateRange = 'Due date';
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

  dueDateFilterList() {
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));
    if (this.selectedDateRange != 'Due date') {
      const startDate =
        this.fromDate.year +
        '-' +
        ('0' + this.fromDate.month).slice(-2) +
        '-' +
        ('0' + this.fromDate.day).slice(-2);

      const endDate =
        this.toDate.year +
        '-' +
        ('0' + this.toDate.month).slice(-2) +
        '-' +
        ('0' + this.toDate.day).slice(-2);

      this.invoiceList = this.invoiceList.filter(
        (item) => item.dueDate >= startDate && item.dueDate <= endDate
      );
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectedDateRange =
        this.fromDate.year +
        '-' +
        this.fromDate.month +
        '-' +
        this.fromDate.day;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectedDateRange =
        this.fromDate.year +
        '-' +
        ('0' + this.fromDate.month).slice(-2) +
        '-' +
        ('0' + this.fromDate.day).slice(-2) +
        ' - ' +
        this.toDate.year +
        '-' +
        ('0' + this.toDate.month).slice(-2) +
        '-' +
        ('0' + this.toDate.day).slice(-2);
      this.dueDateFilterList();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.selectedDateRange = 'Due date';
      this.dueDateFilterList();
    }
  }

  /**
   * returns true/false based on whether date is hovered or not
   * @param date date
   */
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  /**
   * returns true if date is inside selected range
   * @param date date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * returns true if date is in range
   * @param date date
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
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
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));
    if (vendorName != 'All') {
      this.invoiceList = this.invoiceList.filter((item) =>
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
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));
    if (status != 'All') {
      this.invoiceList = this.invoiceList.filter(
        (item) => item.status.toLowerCase() == status.toLowerCase()
      );
    }
  }

  paymentTypeFilterList(id, payment) {
    console.log(payment);
    this.paymentTypeFilter = payment;
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));
    if (payment != 'All') {
      this.invoiceList = this.invoiceList.filter(
        (item) => item.account.toLowerCase() == payment.toLowerCase()
      );
    }
  }

  getList() {
    this.apolloService
      .query(projectbill_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: 0,
        idVendor: 0,
      })
      .then((res) => {
        const result = res.projectbill_list;
        this.invoiceList = result.data;

        this.invoiceList.forEach((item) => {
          if (item.account.length > 4)
            item.account =
              'ACH * ' + item.account.substring(item.account.length - 4);
          else {
            item.account = 'ACH * ' + item.account;
          }
        });
        this.INVOICELIST = JSON.parse(JSON.stringify(this.invoiceList));
        this.loading = false;
      });
  }

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
  
  openPayingBill() {
    this.payingBillModalRef = this.modalService.open(this.payingBillModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '640',
    })
    
    this.payingBillModalRef.result.then(
      (res) => {
        console.log('OK')
      },
      (dismiss) => {
        console.log('dismiss')
      }
    )
  }
}
