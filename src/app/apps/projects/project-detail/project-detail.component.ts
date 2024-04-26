import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'src/app/core/base';
import { EventType } from 'src/app/core/constants/events';
import {
  companyproject_info,
  projectbudget_list,
  companyproject_date
} from 'src/app/core/gql/project';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { EventService } from 'src/app/core/service/event.service';
import { companycategory_list } from "../../../core/gql/costcode";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent extends Base {
  @ViewChild('editProjectModal') editProjectModal: NgbModalRef;
  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef;
  @ViewChild('addCategoryModal') addCategoryModal: any;
  tabs = 1;
  keywords = '';
  
  project = {
    id: 0,
    revision: 0,
    idCompany: 0,
    projectName: 'Project Name',
    projectAddress: 'project address',
    projectBudget: 0.0,
    projectUsed: 0.0,
    projectSqft: 0.0,
    idGroup: 0,
    groupName: '',
    idCompany_payment: 0,
    color: '',
    icon: '',
    pinyn: false,
    owed: 0,
    owedTotal: 0.0,
    overdue: 0,
    overdueTotal: 0.0,
    dueseven: 0,
    duesevenTotal: 0.0,
    duefilter: 0,
    duefilterTotal: 0.0,
    status: '',
    active: false,
    canDelete: false
  };
  
  budgetList = [];
  isLoading = true;
  categoryName = '';
  categoryNameError = false;
  categoryList = [];
  
  selectedDateRange: string = 'Pick Dates';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  
  editProjectModalRef: NgbModalRef;
  editBudgetModalRef: NgbModalRef;
  addCategoryModalRef: NgbModalRef;
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private calendar: NgbCalendar,
    private localStorage: LocalStorageService
  ){super()}
  
  canEdit = false;
  canInviteMember = false;
  
  ngOnInit(): void{
    this.canEdit = super.setRole('Edit Projects');
    this.canInviteMember = super.setRole('Manage project users');
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
    this.activatedRoute.params.subscribe((params) => {
      const idProject = parseInt(params['id']);
      this.getProjectInfo(idProject);
      this.getProjectBudgetList(idProject);
    });
  }
  
  getProjectInfo(id){
    this.apolloService.query(companyproject_info, {id: id}).then((res) => {
      const result = res.companyproject_info;
      if(!result.error){
        this.project = result.data;
        this.localStorage.setItem('projectName', this.project.projectName);
      }
    });
  }
  
  getProjectBudgetList(id){
    this.apolloService.query(projectbudget_list, {idProject: id}).then((res) => {
      const result = res.projectbudget_list;
      if(!result.error){
        this.budgetList = result.data;
      }
      this.isLoading = false;
    });
  }
  
  getDueDateFilter(fromDate, toDate){
    this.apolloService.query(companyproject_date, {
      idProject: this.project.id,
      dateFrom: fromDate,
      dateTo: toDate
    }).then((res) => {
      const result = res.companyproject_date;
      if(!result.error){
        this.project.duefilter = result.data.duefilter;
        this.project.duefilterTotal = result.data.duefilterTotal;
      }
      this.isLoading = false;
    });
  }
  
  editProjectDetails(){
    this.editProjectModalRef = this.modalService.open(this.editProjectModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    this.editProjectModalRef.result.then(
      (result) => {
        // get project
        this.getProjectInfo(this.project.id);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  
  getBackgroundColor(budget){
    if(budget.overdue > 0){
      return 'bg-red';
    }
    if(budget.dueseven > 0){
      return 'bg-yellow';
    }
    if(budget.duefilter > 0){
      return 'bg-blue';
    }
    return 'bg-white';
  }
  
  editProjectBudget(){
    this.editBudgetModalRef = this.modalService.open(this.editBudgetModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    this.editBudgetModalRef.result.then(
      (result) => {
        // get project
        this.getProjectInfo(this.project.id);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  
  inviteMembers(){
    this.eventService.broadcast(EventType.PROJECT_DEDAIL_INVITE, true);
  }
  
  createNew(){
    if(this.tabs < 3){
      this.router.navigate(['apps/order/detail/-' + this.project.id])
    }
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
      this.project.duefilter = 0;
      this.project.duefilterTotal = 0;
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
  
  openAddCategoryModal(){
    this.addCategoryModalRef = this.modalService.open(this.addCategoryModal, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true
    });
    this.addCategoryModalRef.result.then((result) => {
      this.getProjectBudgetList(this.project.id);
    }, (reason) => {
      console.log(reason);
    })
  }
  
}
