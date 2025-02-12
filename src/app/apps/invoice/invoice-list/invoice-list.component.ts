import { Component, ViewChild } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companyproject_list } from 'src/app/core/gql/project';
import { projectbill_list } from 'src/app/core/gql/receivables';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { GlobalFunctionsService } from '../../../core/service/global-functions.service';


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent {
  @ViewChild('addModal') addModal: NgbModalRef;

  addModalRef;
  invoiceList = [];
  INVOICELIST = [];
  filterList = [];
  loading = true;
  direction = 'asc';
  sortColumn = '';
  keywords = '';
  paymentTypeFilter = 'Sender';
  dueDateFilter = 'Due date';
  projectFilter = 'Project';
  statusFilter = 'Active';
  projects = [];
  vendorList = [];
  paymentList = [];
  vendorFilter = 'Sender';

  selectedDateRange: string = 'Due date';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  idInvoice = 0;
  
  
  listStatusCount: any;
  objectKeys = Object.keys;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar,
    private localStorage: LocalStorageService,
    private globalFuns: GlobalFunctionsService,
  ) {}

  ngOnInit(): void {
    this.listStatusCount = {...this.globalFuns.BillStatusCount};
    if (this.localStorage.getItem('idcompany')) {
      this.getList();
      this.getProjectList();
      this.getVendorList();

      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
      this.selectedDateRange = 'Due date';
    } else {
      this.loading = false;
    }
  }

  getProjectList() {
    this.apolloService
      .query(companyproject_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companyproject_list;
        if (!result.error) {
          this.projects = result.data;
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

  getVendorList() {
    this.apolloService
      .query(vendor_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.vendor_list;
        if (!result.error) {
          this.vendorList = result.data;
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

  filterProjectList(projectName) {
    this.projectFilter = projectName;
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));
    if (projectName != 'All') {
      this.invoiceList = this.invoiceList.filter((item) =>
        item.projectName.toLowerCase().includes(projectName.toLowerCase())
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

    this.invoiceList = [...this.invoiceList].sort((a, b) => {
      const res = this.compare(a[this.sortColumn], b[this.sortColumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

  filterTable = (request: any) => {
    if ((this.statusFilter !== 'Active' && request.status != this.statusFilter) || (this.statusFilter == 'Active' && request.status == 'Paid') || (this.statusFilter == 'Active' && request.status == 'Declined')) {
      return false;
    }
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
  
  
  statusFilterChange(e, status, type) {
    if (this[type] === status) {
      setTimeout(() => {
        e.target.checked = true;
      }, 50);
    }
    this[type] = status;
  }

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
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idProject: 0,
        idVendor: 0,
        idOrder1: 0
      })
      .then((res) => {
        const result = res.projectbill_list;
        this.invoiceList = result.data;

        this.invoiceList.forEach((item) => {
          if (item.account.length > 4)
            item.account = item.payType +
              ' * ' + item.account.substring(item.account.length - 4);
          else {
            item.account =  item.payType + ' * ' + item.account;
          }
        });
        this.INVOICELIST = JSON.parse(JSON.stringify(this.invoiceList));
        this.getStatusCount();
        this.loading = false;
      });
  }
  
  getStatusCount() {
    let listStatusCount = {...this.globalFuns.BillStatusCount};
    
    this.INVOICELIST.map((invoice) => {
      if(!listStatusCount[invoice.status]){
        listStatusCount[invoice.status]=0;
      }
      listStatusCount[invoice.status]++;
    })
    this.listStatusCount = listStatusCount;
  }

  openInvoiceModal() {
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

  openAddModal() {
    this.idInvoice = 0;
    this.openInvoiceModal();
  }

  openEditModal(id) {
    this.idInvoice = id;
    this.openInvoiceModal();
  }
  
  protected readonly globalFunc = this.globalFuns;
}
