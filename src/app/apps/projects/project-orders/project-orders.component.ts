import { Component, Input, ViewChild } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../core/service/http.service";
import { Router } from "@angular/router";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { Base } from 'src/app/core/base';
import { projectorder_list } from "../../../core/gql/orders";

@Component({
  selector: 'app-project-orders',
  templateUrl: './project-orders.component.html',
  styleUrls: ['./project-orders.component.scss']
})
export class ProjectOrdersComponent extends Base {
  @Input() idProject;
  @ViewChild('uploadAttachment') uploadAttachment: NgbModalRef;
  
  
  orders = [];
  InitialOrders = [];
  currentOrderId: number = 0;
  scrollOptions = {
    forceVisible: true
  };
  
  keywords = '';
  direction = 'asc';
  sortColumn = '';
  edit = [];
  loading = true;
  
  canEdit = false;
  objectKeys = Object.keys;
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  
  uploadIdOrder1;
  uploadAttachmentRef: NgbModalRef;
  
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
  }
  
  
  getOrders(){
    if(localStorage.getItem('idcompany') && this.idProject){
      this.apolloService.query(projectorder_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: this.idProject
      }).then((res) => {
        const result = res.projectorder_list;
        if(!result.error){
          this.orders = result.data;
          this.InitialOrders = JSON.parse(JSON.stringify(result.data));
          this.loading = false;
        }
      });
    }else{
      this.loading = false;
    }
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
  
  filterTable = (order: any) => {
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
    this.uploadAttachmentRef = this.modalService.open(this.uploadAttachment, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530',
    })
    this.uploadAttachmentRef.result.then((res)=>{
    }, (dismiss) => {
    
    })
  }
  
}
