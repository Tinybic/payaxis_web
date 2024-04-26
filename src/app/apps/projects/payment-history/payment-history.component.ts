import { Component } from '@angular/core';
import { NgbCalendar, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ApolloService } from "../../../core/service/apollo.service";
import { projectpayment_history } from "../../../core/gql/payment";
import { ActivatedRoute } from "@angular/router";
import { formatDate, formatCurrency } from "@angular/common";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent {
  loading = true;
  idProject = 0;
  paymentHistoryList = [];
  PAYMENTREQUESTLIST = [];
  direction = 'asc';
  sortColumn = '';
  keywords = '';
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
  
  csvData=[];
  
  
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info',
  ];
  
  constructor(
    private apolloService: ApolloService,
    private calendar: NgbCalendar,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {}
  
  ngOnInit(): void {
    if (this.localStorage.getItem('idcompany')) {
      this.toDate = this.calendar.getToday();
      this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'm', -1);
      this.selectedDateRange = this.getDateRange();
      
      
      this.activatedRoute.params.subscribe((params) => {
        this.idProject = parseInt(params['id']);
        this.getPaymentHistoryList();
      });
    } else {
      this.loading = false;
    }
  }
  
  
  dueDateFilterList() {
    this.paymentHistoryList = JSON.parse(
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
      
      this.paymentHistoryList = this.paymentHistoryList.filter(
        (item) => item.dueDate >= startDate && item.dueDate <= endDate
      );
    }
  }
  
  getDateRange(){
    if(this.toDate){
      const thisYear = new Date().getFullYear();
      if(this.toDate.year == thisYear && this.fromDate.year == thisYear){
        if(this.toDate.month == this.fromDate.month){
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + this.toDate.day + ',' + this.fromDate.year;
        } else{
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' + this.toDate.day, 'MMM d', 'en');
        }
      } else{
        return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en') + ' - ' + formatDate(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day, 'MMM d, y', 'en');
      }
    } else{
      return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en');
    }
  }
  
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectedDateRange = this.getDateRange();
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectedDateRange = this.getDateRange();
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
    
    this.paymentHistoryList = [...this.paymentHistoryList].sort((a, b) => {
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
        request.orderNumber
        .toString()
        .toLowerCase()
        .includes(this.keywords.toLowerCase()) ||
        request.amount
        .toString()
        .toLowerCase()
        .includes(this.keywords.toLowerCase()) ||
        (request.senderLastname + ' ' + request.senderFirstname)
        .toString()
        .toLowerCase()
        .includes(this.keywords.toLowerCase())
    );
  };
  
  filterListStatus(status) {
    this.statusFilter = status;
    let paymentHistoryList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    if (status != 'All') {
      this.paymentHistoryList = paymentHistoryList.filter(
        (item) => item.status.toLowerCase() == status.toLowerCase()
      );
    }else {
      this.paymentHistoryList = paymentHistoryList;
    }
  }
  
  getPaymentHistoryList() {
    const dateFrom =
      this.fromDate.year +
      '-' +
      ('0' + this.fromDate.month).slice(-2) +
      '-' +
      ('0' + this.fromDate.day).slice(-2);
    
    const dateTo =
      this.toDate.year +
      '-' +
      ('0' + this.toDate.month).slice(-2) +
      '-' +
      ('0' + this.toDate.day).slice(-2);
    this.apolloService
    .query(projectpayment_history, {
      idCompany: parseInt(this.localStorage.getItem('idcompany')),
      idProject: this.idProject,
      idVendor: 0,
      dateFrom: dateFrom,
      dateTo: dateTo,
    })
    .then((res) => {
      const result = res.projectpayment_history;
      this.paymentHistoryList = result.data;
      this.PAYMENTREQUESTLIST = JSON.parse(
        JSON.stringify(this.paymentHistoryList)
      );
      this.loading = false;
    });
  }
  
  
  filterListSearchWithStatus(){
    let paymentHistoryList = JSON.parse(
      JSON.stringify(this.PAYMENTREQUESTLIST)
    );
    
    if (this.statusFilter != 'All') {
      paymentHistoryList = paymentHistoryList.filter(
        (item) => item.status.toLowerCase() == this.statusFilter.toLowerCase()
      );
    }
    
    paymentHistoryList = paymentHistoryList.filter((item)=>{
      return this.filterTable(item);
    })
    
    return paymentHistoryList;
  }
  
  getPaymentAmountSummary(){
    const paymentHistoryList = this.filterListSearchWithStatus();
    let summary = 0;
    paymentHistoryList.map((item) => {
      summary += item.amount;
    })
    
    return summary;
  }

  exportCsv(): void {
    let csvData = [];
    const paymentHistoryList = this.filterListSearchWithStatus();
    paymentHistoryList.map((item) => {
      csvData.push({
        'Changes': 'Scheduled',
        'Order #': item.orderNumber,
        'Status': item.status,
        'Vendor': item.vendorName,
        'Payment Method': item.payType + ' / ' + item.account,
        'Payment Date': formatDate(item.dueDate, 'MM/dd/yyyy', 'en'),
        'Additions': 'Sent to Vendor',
        'Amount': formatCurrency(item.amount, 'en-US', '$','USD'),
        'User': item.senderLastname + ' ' + item.senderFirstname,
        'Last Updated': formatDate(item.modifiedDate, 'MM/dd/yyyy HH:mm:ss', 'en'),
      })
    })
    this.csvData = csvData;
  }
}
