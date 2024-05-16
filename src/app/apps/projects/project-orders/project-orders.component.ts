import { Component, Input, ViewChild } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../core/service/http.service";
import { Router } from "@angular/router";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { Base } from 'src/app/core/base';
import { projectorder_list } from "../../../core/gql/orders";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { projectpayment_new } from 'src/app/core/gql/receivables';
import { companypayment_list } from 'src/app/core/gql/payment';

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
  
  uploadIdOrder1: number;
  uploadAttachmentRef: NgbModalRef;
  payingBillModalRef: NgbModalRef;
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService,
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
  toggleOrderChecked(){
    let allOrdersChecked = true;
    this.orders.map((item) => {
      if(allOrdersChecked && item.status !== 'Paid'){
        allOrdersChecked = item.checked;
      }
    })
    this.allOrdersChecked = allOrdersChecked;
  }
  
  toggleAllOrdersChecked(){
    this.orders.map((item) => {
      if(item.status !== 'Paid'){
        item.checked = this.allOrdersChecked;
      }
    })
  }
  
  paySelectedBtnStatus(){
    return !this.orders.some((item) => item.checked)
  }
  
  filterSelectedOrders(){
    return this.orders.filter((item) => item.checked);
  }
  
  openPaySelectedModal(){
    this.payingBillModalRef = this.modalService.open(this.payingBillModal, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '640',
    });
    
    this.payingBillModalRef.result.then(
      (res) => {
        console.log('OK');
        this.getOrders();
      },
      (dismiss) => {
        console.log('dismiss');
      }
    );
  }

  confirmObj = {
    title: 'Pay this order',
    message: 'Do you want to pay this order ?',
    btnConfirm: 'Yes',
    serviceName: projectpayment_new,
    params: {},
    btnSide: 'end',
  };
  confirmModalRef: NgbModalRef;
  vendor;
  projectPayment;
  payBill(item) {
    if (item.remainingAmount > 0) {
      this.confirmObj.params = {
        idCompany: item.idCompany,
        idProject: item.idProject,
        idVendor: item.idVendor,
        idOrder1: item.id,
        idCompany_payment: 0,
        billNumber: item.orderNumber,
        sentDate: item.invoicedDate,
        dueDate: item.indvoicedueDate,
        paymentTerms: '',
        amount: item.remainingAmount,
        txtNotes: item.notes,
        billyn: true,
        costCode: item.costCode,
        paymentFiles: [],
        idInvitedCompany: 0,
        vendorName: item.vendorName,
        vendorEmail: '',
        status: '',
        account: '',
        payType: '',
      };

      this.confirmModalRef = this.modalService.open(this.confirmModal, {
        size: '443',
        centered: true,
      });

      this.confirmModalRef.result.then(
        (result) => {
          this.vendor = {
            id: item.idVendor,
            vendorName: item.vendorName,
          };
          this.projectPayment = {
            id: result.data.id,
            idCompany: item.idCompany,
            idProject: item.idProject,
            idVendor: item.idVendor,
            idOrder1: item.id,
            idCompany_payment: 0,
            revision: result.data.revision,
            billNumber: item.orderNumber,
            sentDate: item.invoicedDate,
            dueDate: item.indvoicedueDate,
            paymentTerms: '',
            amount: item.remainingAmount,
            txtNotes: item.notes,
            billyn: true,
            costCode: item.costCode,
            paymentFiles: [],
            idInvitedCompany: 0,
            vendorName: item.vendorName,
            vendorEmail: '',
            status: '',
            account: '',
            payType: '',
          };
          this.getPaymentList();
          this.confirmModalRef.close();
        },
        (reason) => {
          console.log(reason);
        }
      );
    }
  }
  paymentList = [];
  getPaymentList() {
    this.apolloService
      .query(companypayment_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companypayment_list;
        if (!result.error) {
          this.paymentList = result.data;
          this.openPayingBill();
        }
      });
  }

  openPayingBill() {
    if (this.paymentList.length == 0) {
      this.toastrService.info(
        'No payment method available, please go to company settings and add a new payment method.',
        'Warning',
        {
          timeOut: 6000,
          enableHtml: true,
          toastClass: 'max-width-300 text-white',
        }
      );
    } else {
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
          this.getOrders();
        }
      );
    }
  }
  
  protected readonly globalFunc=this.globalFuns;
}
