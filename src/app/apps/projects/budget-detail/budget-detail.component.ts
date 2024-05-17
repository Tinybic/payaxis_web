import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { companyproject_date, companyproject_summary } from "../../../core/gql/project";
import { ApolloService } from "../../../core/service/apollo.service";
import { projectorder_list } from "../../../core/gql/orders";
import { Projectsummaryall } from "../../../core/generated/generated";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-budget-detail',
  templateUrl: './budget-detail.component.html',
  styleUrls: ['./budget-detail.component.scss']
})
export class BudgetDetailComponent {
  
  id: number = 0;
  name: string = '';
  projectId: number = 0;
  projectName: string = '';
  
  orders = [];
  InitialOrders = [];
  ordersStatusCount = {
    All: 0,
    Active: 0,
    Overdue: 0,
    'Partially Paid': 0,
    Due: 0,
    Draft: 0,
    Paid: 0
  };
  budgetSummary: Projectsummaryall[] = [];
  
  
  selectedDateRange: string = 'Pick Dates';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  
  
  scrollOptions = {
    forceVisible: true,
  };
  keywords = '';
  statusFilter: string = 'All';
  objectKeys = Object.keys;
  direction = 'asc';
  sortColumn = '';
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info',
  ];
  loading = true;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apolloService: ApolloService,
    private calendar: NgbCalendar,
    private globalFuns: GlobalFunctionsService,
    private localStorage: LocalStorageService
  ){}
  
  ngOnInit(){
    this.id = parseInt(this.activatedRoute.snapshot.queryParams['id']);
    this.name = this.activatedRoute.snapshot.queryParams['name'];
    this.projectId = parseInt(this.activatedRoute.snapshot.queryParams['pid']);
    this.projectName = this.activatedRoute.snapshot.queryParams['pname'];
    
    
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.fromDate, 'm', 1);
    this.selectedDateRange =
      this.getShortMonth(this.fromDate.month) +
      ' ' +
      this.fromDate.day +
      ' - ' +
      this.getShortMonth(this.toDate.month) +
      ' ' +
      this.toDate.day;
    
    this.getOrders();
    this.getBudgetSummary();
  }
  
  
  getBudgetSummary(){
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
    this.apolloService.query(companyproject_summary, {
      idProject: this.projectId,
      idCategory: this.id,
      dateFrom: dateFrom,
      dateTo: dateTo
    }).then((res) => {
      const result = res.companyproject_summary;
      if(!result.error){
        this.budgetSummary = JSON.parse(JSON.stringify(result.data));
      }
    });
  }
  
  getOrders(){
    if(this.localStorage.getItem('idcompany')){
      this.apolloService.query(projectorder_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idProject: this.projectId
      }).then((res) => {
        const result = res.projectorder_list;
        if(!result.error){
          this.orders = result.data;
          this.InitialOrders = JSON.parse(JSON.stringify(result.data));
          this.getStatusCount();
          this.loading = false;
        }
      });
    }
  }
  
  
  getStatusCount(){
    let ordersStatusCount = {
      All: this.InitialOrders.length,
      Active: 0,
      Overdue: 0,
      'Partially Paid': 0,
      Due: 0,
      Draft: 0,
      Paid: 0
    };
    this.InitialOrders.map((order) => {
      ordersStatusCount[order.status]++;
    });
    
    this.ordersStatusCount = ordersStatusCount;
  }
  
  
  getDueDateFilter(fromDate, toDate){
    this.apolloService.query(companyproject_date, {
      idProject: this.projectId,
      idCategory: this.id,
      dateFrom: fromDate,
      dateTo: toDate
    }).then((res) => {
      const result = res.companyproject_date;
      if(!result.error){
        this.budgetSummary['duefilter'] = result.data.duefilter;
        this.budgetSummary['duefilterTotal'] = result.data.duefilterTotal;
      }
    });
  }
  
  
  dueDateFilterList(){
    if(this.selectedDateRange != 'Due date'){
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
      this.getDueDateFilter(startDate, endDate);
    }
  }
  
  getShortMonth(month: number){
    const date = new Date(1980, month, 0);
    return date.toLocaleDateString('en-US', {
      month: 'short'
    })
  }
  
  onDateSelection(date: NgbDate){
    if(!this.fromDate && !this.toDate){
      this.fromDate = date;
      this.selectedDateRange =
        this.getShortMonth(this.fromDate.month) +
        ' ' +
        this.fromDate.day;
    } else if(this.fromDate && !this.toDate && date.after(this.fromDate)){
      this.toDate = date;
      this.selectedDateRange =
        this.getShortMonth(this.fromDate.month) +
        ' ' +
        this.fromDate.day +
        ' - ' +
        this.getShortMonth(this.toDate.month) +
        ' ' +
        this.toDate.day;
      this.dueDateFilterList();
    } else{
      this.toDate = null;
      this.fromDate = date;
      this.selectedDateRange = 'Due date';
      // this.project.duefilter=0;
      // this.project.duefilterTotal=0;
    }
  }
  
  /**
   * returns true/false based on whether date is hovered or not
   * @param date date
   */
  isHovered(date: NgbDate){
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
  isInside(date: NgbDate){
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  
  /**
   * returns true if date is in range
   * @param date date
   */
  isRange(date: NgbDate){
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  
  
  createNew(){
      this.router.navigate(['apps/order/detail/0'],{ queryParams: {idProject: this.projectId}});
  }
  
  
  statusFilterChange(e, status, type) {
    if (this[type] === status) {
      setTimeout(() => {
        e.target.checked = true;
      }, 50);
    }
    this[type] = status;
  }
  
  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(column: string): void {
    this.sortColumn = column;
    const result = this.globalFuns.onSort(
      this.InitialOrders,
      this.sortColumn,
      this.direction
    );
    this.orders = result.newArray;
    this.direction = result.direction;
  }
  
  
  filterTable = (order: any) => {
    if (this.statusFilter !== 'All' && order.status != this.statusFilter) {
      return false;
    }
    
    let values = Object.values(order);
    return values.some((v: any) =>
      v.toString().toLowerCase().includes(this.keywords.toLowerCase())
    );
  };
  
  openDetail(id) {
    this.router.navigate(['apps/order/detail/' + id]);
  }
  
}
