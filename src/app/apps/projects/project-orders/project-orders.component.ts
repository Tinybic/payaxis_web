import { Component, Input, ViewChild } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { Base } from 'src/app/core/base';
import { projectorder_list } from "../../../core/gql/orders";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-project-orders',
  templateUrl: './project-orders.component.html',
  styleUrls: ['./project-orders.component.scss']
})
export class ProjectOrdersComponent extends Base {
  @Input() idProject;
  @ViewChild('uploadAttachmentModal') uploadAttachmentModal: NgbModalRef;
  @ViewChild('payingBillModal') payingBillModal: NgbModalRef;
  @ViewChild('confirmModal') confirmModal: NgbModalRef;
  
  
  orders = [];
  InitialOrders = [];
  scrollOptions = {
    forceVisible: true
  };
  
  statusFilter: string = 'Active';
  listStatusCount: any;
  objectKeys = Object.keys;
  keywords = '';
  direction = 'asc';
  sortColumn = '';
  edit = [];
  loading = true;
  
  canEdit = false;
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  
  allOrdersChecked = false;
  selectedOrders:any = [];
  
  uploadIdOrder1: number;
  uploadAttachmentRef: NgbModalRef;
  payingBillModalRef: NgbModalRef;
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private router: Router,
    private globalFuns: GlobalFunctionsService,
    private localStorage: LocalStorageService
  ){
    super();
  }
  
  
  ngOnInit(): void{
    this.canEdit = super.setRole('Manage company users');
    this.listStatusCount = {...this.globalFuns.POStatusCount};
    this.getOrders();
  }
  
  
  getOrders(){
    if(this.localStorage.getItem('idcompany') && this.idProject){
      this.apolloService.query(projectorder_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idProject: this.idProject
      }).then((res) => {
        const result = res.projectorder_list;
        if(!result.error){
          this.allOrdersChecked=false;
          this.orders = result.data;
          this.InitialOrders = JSON.parse(JSON.stringify(result.data));
          this.getStatusCount();
          this.loading = false;
        }
      });
    }else{
      this.loading = false;
    }
  }
  
  getStatusCount(){
    let listStatusCount = {...this.globalFuns.POStatusCount};
    
    this.InitialOrders.map((invoice) => {
      if(!listStatusCount[invoice.status]){
        listStatusCount[invoice.status] = 0;
      }
      listStatusCount[invoice.status]++;
    })
    this.listStatusCount = listStatusCount;
  }
  
  
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
  
  statusFilterChange(e, status, type){
    if(this[type] === status){
      setTimeout(() => {
        e.target.checked = true;
      }, 50);
    }
    this[type] = status;
  }
  
  filterTable = (order: any) => {
    if((this.statusFilter !== 'Active' && order.status != this.statusFilter) || (this.statusFilter == 'Active' && order.status == 'Paid')){
      return false;
    }
    let values = Object.values(order);
    return values.some(
      (v: any) =>
        v.toString().toLowerCase().includes(this.keywords.toLowerCase())
    );
  }
  
  openDetail(id){
    this.router.navigate(['apps/order/detail/' + id]);
  }
  
  uploadAttachments(order) {
    this.uploadIdOrder1 = order.id;
    this.uploadAttachmentRef = this.modalService.open(this.uploadAttachmentModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530',
    })
    this.uploadAttachmentRef.result.then((res)=>{
    }, (dismiss) => {
    
    })
  }
  
  payBill(item){
    this.selectedOrders=[item];
    this.openPaySelectedModal();
  }
  
  toggleOrderChecked(){
    this.selectedOrders=[];
    let allOrdersChecked = true;
    this.orders.map((item) => {
      if(item.checked){
        this.selectedOrders.push(item);
      }
      if(allOrdersChecked && item.status !== 'Paid'){
        allOrdersChecked = item.checked;
      }
    })
    this.allOrdersChecked = allOrdersChecked;
  }
  
  toggleAllOrdersChecked(){
    if(this.allOrdersChecked){
      this.selectedOrders = this.orders.filter((order)=>order.status != 'Paid');
    }else {
      this.selectedOrders=[];
    }
    this.orders.map((item) => {
      if(item.status !== 'Paid'){
        item.checked = this.allOrdersChecked;
      }
    })
  }
  
  paySelectedBtnStatus(){
    return !this.orders.some((item) => item.checked)
  }
  
  openPaySelectedModal(){
    this.payingBillModalRef = this.modalService.open(this.payingBillModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '640',
    });
    
    this.payingBillModalRef.result.then(
      (res) => {
        this.getOrders();
      },
      (dismiss) => {
        console.log('dismiss');
      }
    );
  }
  
  protected readonly globalFunc=this.globalFuns;
}
