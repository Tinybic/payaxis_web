import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companypayment_list } from 'src/app/core/gql/payment';
import { projectpayment_list, receivable_list } from 'src/app/core/gql/receivables';
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

  selectedDateRange: string = 'Due date';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  selectId = 0;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('idcompany')) {
      this.getList();
      this.getVendorList();
      this.getPaymentList();

      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
      this.selectedDateRange = 'Due date';
    } else {
      this.loading = false;
    }
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
    this.paymentRequestList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
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

      this.paymentRequestList = this.paymentRequestList.filter(
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
    this.paymentRequestList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    if (vendorName != 'All') {
      this.paymentRequestList = this.paymentRequestList.filter((item) =>
        item.vendorName.toLowerCase().includes(vendorName.toLowerCase())
      );
    }
  }

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  onSort(column) {
    this.sortColumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.paymentRequestList = [...this.paymentRequestList].sort((a, b) => {
      const res = this.compare(a[this.sortColumn], b[this.sortColumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

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
      .query(receivable_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.receivable_list;
        this.paymentRequestList = result.data;
        this.PAYMENTREQUESTLIST = JSON.parse(
          JSON.stringify(this.paymentRequestList)
        );
        this.loading = false;
      });
  }

  addModalRef;

  openModal() {
    this.addModalRef = this.modalService.open(this.addModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '640',
    });
    this.addModalRef.result.then(
      (res) => {
        this.addModalRef = null;
        this.getList();
      },
      (dismiss) => {
        this.addModalRef = null;
        this.getList();
      }
    );
  }

  openDetail(id) {
    this.router.navigate(['apps/receivables/detail/' + id]);
  }

  openAddModal() {
    this.selectId = 0;
    this.openModal();
  }

  openEditModal(id) {
    this.selectId = id;
    this.openModal();
  }
}
