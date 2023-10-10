import { Component } from '@angular/core';
import { ApolloService } from '../../core/service/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { projectorder_list } from '../../core/gql/orders'
import { SweetAlertOptions } from 'sweetalert2';
import { Base } from 'src/app/core/base';
import { Router } from '@angular/router';
import { HttpService } from "../../core/service/http.service";
import { company_roles } from "../../core/gql/company";
import { GlobalFunctionsService } from "../../core/service/global-functions.service";
import { companyproject_list } from 'src/app/core/gql/project';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends Base {
  statusFilter: string = 'All';
  roleFilter = 'Approval';
  
  orders = [];
  currentOrderId: number = 0;
  uploadUrl = '';
  scrollOptions = {
    forceVisible: true
  };
  
  roles = [];
  projects = [];
  
  InitialOrders = [];
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  ordersStatusCount = {
    All: 0,
    Active: 0,
    Overdue: 0,
    'Partially Paid': 0,
    Due: 0,
    Draft: 0
  }
  showCount: number = 0;
  keywords = '';
  direction = 'asc';
  sortColumn = '';
  edit = [];
  loading = true;
  
  canEdit = false;
  objectKeys = Object.keys;
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService,
    private router: Router,
    private globalFuns: GlobalFunctionsService
  ){
    super();
  }
  
  ngOnInit(): void{
    this.canEdit = super.setRole('Manage company users');
    this.getOrders();
    this.getRoles();
    this.getProjects();
  }
  
  getOrders(){
    if(localStorage.getItem('idcompany')){
      this.apolloService.query(projectorder_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: 0
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
  
  getRoles(){
    this.apolloService.query(company_roles, {
      idCompany: parseInt(localStorage.getItem('idcompany'))
    }).then((res) => {
      const result = res.company_roles;
      if(!result.error){
        this.roles = JSON.parse(JSON.stringify(result.data));
        this.roles.map(role => {
          role['id']=role.idRole;
          role['checked'] = false
        });
        this.roles.unshift({
          id: 'all',
          txtName: 'All',
          checked: true
        })
      }
    });
  }
  
  getProjects(){
    this.apolloService.query(companyproject_list,
      {idCompany: parseInt(localStorage.getItem('idcompany'))}).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.projects = JSON.parse(JSON.stringify(result.data));
        this.projects.map(project => project['checked'] = false);
        this.projects.unshift({
          id: 'all',
          projectName: 'All',
          checked: true
        })
      }
    });
  }
  
  getStatusCount(){
    let ordersStatusCount = {
      All: this.InitialOrders.length,
      Active: 0,
      Overdue: 0,
      'Partially Paid': 0,
      Due: 0,
      Draft: 0
    }
    this.InitialOrders.map(order => {
      ordersStatusCount[order.status]++;
    })
    
    this.ordersStatusCount = ordersStatusCount;
  }
  
  statusFilterChange(e, status, type){
    if(this[type] === status){
      setTimeout(() => {
        e.target.checked = true;
      }, 50)
    }
    this[type] = status;
  }
  
  filterChange(item, type){
    if(item.id == 'all'){
      this[type].map(item => {
        item.checked = this[type][0].checked;
      })
    } else{
      let itemsCheckedCount = 0;
      this[type].map(item => {
        if(item.id != 'all' && item.checked){
          itemsCheckedCount++;
        }
      })
      this[type][0].checked = itemsCheckedCount == this[type].length - 1
    }
  }
  
  changeRoleFilter(filter: string){
    this.roleFilter = filter;
    this.orders = this.InitialOrders;
    if(filter != 'All'){
      this.orders = this.orders.filter((member) => member.role == filter);
    }
  }
  
  public alertOption: SweetAlertOptions = {};
  
  
  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(column: string): void{
    this.sortColumn = column;
    const result = this.globalFuns.onSort(
      this.InitialOrders,
      this.sortColumn,
      this.direction
    )
    this.orders = result.newArray;
    this.direction = result.direction;
  }
  
  filterTable = (order: any) => {
    if(this.statusFilter !== 'All' && order.status != this.statusFilter){
      return false;
    }
    if(!(this.projects.some(project => {
      return (project.id == order.idProject && project.checked);
    }) || this.projects.every(project => {return !project.checked}))){
      return false;
    }
    
    let values = Object.values(order);
    return values.some(
      (v: any) =>
        v.toString().toLowerCase().includes(this.keywords.toLowerCase())
    );
  };
  
  openDetail(id){
    this.router.navigate(['apps/order/detail/' + id]);
  }
}
