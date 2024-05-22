import { Component, Input, ViewChild } from '@angular/core';
import { ApolloService } from '../../../core/service/apollo.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Base } from 'src/app/core/base';
import { Router } from '@angular/router';
import { company_roles } from '../../../core/gql/company';
import { GlobalFunctionsService } from '../../../core/service/global-functions.service';
import { companyproject_list } from 'src/app/core/gql/project';
import {
  projectpayment_new,
  receivable_list
} from 'src/app/core/gql/receivables';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { projectorder_duplicate } from '../../../core/gql/order';
import { ToastrService } from 'ngx-toastr';
import { companypayment_list } from '../../../core/gql/payment';
import { projectorder_list } from '../../../core/gql/orders';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent extends Base {
  @ViewChild('paymentRequestModal') paymentRequestModal: NgbModalRef;
  @ViewChild('confirmModal') confirmModal: NgbModalRef;
  @ViewChild('payingBillModal') payingBillModal: NgbModalRef;
  
  tab = 1;
  statusFilter: string = 'Active';
  roleFilter = 'Approval';
  orders = [];
  scrollOptions = {
    // autoHide: false,
    forceVisible: false
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
  keywords = '';
  direction = 'asc';
  sortColumn = '';
  canEdit = false;
  loading = true;
  
  selectedOrder: any;
  projectPayment: any;
  paymentList: any[];
  selectedOrders: any[];
  
  listStatusCount: any;
  objectKeys = Object.keys;
  
  paymentRequestModalRef: NgbModalRef;
  confirmObj = {
    title: 'Pay this order',
    message: 'Do you want to pay this order ?',
    btnConfirm: 'Yes',
    serviceName: projectpayment_new,
    params: {},
    btnSide: 'end'
  };
  confirmModalRef: NgbModalRef;
  payingBillModalRef: NgbModalRef;
  
  constructor(
    private apolloService: ApolloService,
    private router: Router,
    private globalFuns: GlobalFunctionsService,
    private modalService: NgbModal,
    private localStorage: LocalStorageService,
    private toastrService: ToastrService
  ){
    super();
  }
  
  ngOnInit(): void{
    this.canEdit = super.setRole('Edit Order');
    this.listStatusCount = {...this.globalFuns.POStatusCount};
    if(this.localStorage.getItem('idcompany')){
      setTimeout(() => {
        this.tab = parseInt(window.localStorage.getItem('OrdersTabActiveIndex'))
        this.getOrders();
        this.getRoles();
        this.getProjects();
        this.getPaymentList();
      }, 0)
    } else{
      this.loading = false;
    }
  }
  
  getOrders(){
    if(this.localStorage.getItem('idcompany')){
      let serviceName =
        this.tab == 1 ? projectorder_list : receivable_list;
      this.apolloService.query(serviceName, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idProject: 0
      }).then((res) => {
        const result: any = Object.values(res)[0];
        if(!result.error){
          this.orders = result.data;
          this.InitialOrders = JSON.parse(JSON.stringify(result.data));
          this.getStatusCount();
        }
      }).catch((reason) => {
        this.toastrService.info(reason, '');
      }).finally(() => {
        this.loading = false;
      });
    }
  }
  
  getRoles(){
    this.apolloService.query(company_roles, {
      idCompany: parseInt(this.localStorage.getItem('idcompany'))
    }).then((res) => {
      const result = res.company_roles;
      if(!result.error){
        this.roles = JSON.parse(JSON.stringify(result.data));
        this.roles.map((role) => {
          role['id'] = role.idRole;
          role['checked'] = true;
        });
        this.roles.unshift({
          id: 'all',
          txtName: 'All',
          checked: true
        });
      }
    });
  }
  
  getProjects(){
    this.apolloService.query(companyproject_list, {
      idCompany: parseInt(this.localStorage.getItem('idcompany'))
    }).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.projects = JSON.parse(JSON.stringify(result.data));
        this.projects.map((project) => (project['checked'] = true));
        this.projects.unshift({
          id: 'all',
          projectName: 'All',
          checked: true
        });
      }
    });
  }
  
  getStatusCount(){
    let listStatusCount = {...this.globalFuns.POStatusCount};
    
    this.InitialOrders.map((invoice) => {
      if(!listStatusCount[invoice.status]){
        listStatusCount[invoice.status] = 0;
      }
      listStatusCount[invoice.status]++;
    });
    this.listStatusCount = listStatusCount;
  }
  
  statusFilterChange(e, status, type){
    if(this[type] === status){
      setTimeout(() => {
        e.target.checked = true;
      }, 50);
    }
    this[type] = status;
  }
  
  filterChange(item, type){
    if(item.id == 'all'){
      this[type].map((item) => {
        item.checked = this[type][0].checked;
      });
    } else{
      let itemsCheckedCount = 0;
      this[type].map((item) => {
        if(item.id != 'all' && item.checked){
          itemsCheckedCount++;
        }
      });
      this[type][0].checked = itemsCheckedCount == this[type].length - 1;
    }
  }
  
  changeRoleFilter(filter: string){
    this.roleFilter = filter;
    this.orders = this.InitialOrders;
    if(filter != 'All'){
      this.orders = this.orders.filter((member) => member.role == filter);
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
    );
    this.orders = result.newArray;
    this.direction = result.direction;
  }
  
  filterTable = (order: any) => {
    if(
      (this.statusFilter !== 'Active' && order.status != this.statusFilter) ||
      (this.statusFilter == 'Active' && order.status == 'Paid')
    ){
      return false;
    }
    if(
      !(
        this.projects.some((project) => {
          return (
            (project.id == order.idProject && project.checked) ||
            (project.id == 'all' && project.checked)
          );
        }) ||
        this.projects.every((project) => {
          return !project.checked;
        })
      )
    ){
      return false;
    }
    
    let values = Object.values(order);
    return values.some((v: any) =>
      v.toString().toLowerCase().includes(this.keywords.toLowerCase())
    );
  };
  
  openDetail(id){
    if(this.tab == 1){
      this.router.navigate(['apps/order/detail/' + id]);
    } else{
      this.router.navigate(['apps/order/info/' + id]);
    }
  }
  
  duplicateOrder(id, idVendor, revision){
    if(id > 0){
      this.apolloService.mutate(projectorder_duplicate, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idVendor: idVendor,
        id: id,
        revision: revision
      }).then((res) => {
        let result = res.projectorder_duplicate;
        let message = '';
        if(!result.error){
          message = 'Duplicate successful';
          this.router.navigate(['apps/order/detail/' + result.data.id]);
        } else{
          message = result.message;
        }
        this.toastrService.info(message, '', {
          positionClass: 'toast-top-right-order'
        });
      });
    }
  }
  
  payBill(item){
    if(item.remainingAmount > 0){
      this.selectedOrders = [item];
      this.openPayingBill();
      // this.confirmObj.params = {
      //   idCompany: item.idCompany,
      //   idProject: item.idProject,
      //   idVendor: item.idVendor,
      //   idOrder1: item.id,
      //   idCompany_payment: 0,
      //   billNumber: item.orderNumber,
      //   sentDate: item.invoicedDate,
      //   dueDate: item.indvoicedueDate,
      //   paymentTerms: '',
      //   amount: item.remainingAmount,
      //   txtNotes: item.notes,
      //   billyn: true,
      //   costCode: item.costCode,
      //   paymentFiles: [],
      //   idInvitedCompany: 0,
      //   vendorName: item.vendorName,
      //   vendorEmail: '',
      //   status: '',
      //   account: '',
      //   payType: '',
      // };
      //
      // this.confirmModalRef = this.modalService.open(this.confirmModal, {
      //   size: '443',
      //   centered: true,
      // });
      //
      // this.confirmModalRef.result.then(
      //   (result) => {
      //     this.vendor = {
      //       id: item.idVendor,
      //       vendorName: item.vendorName,
      //     };
      //     this.projectPayment = {
      //       id: result.data.id,
      //       idCompany: item.idCompany,
      //       idProject: item.idProject,
      //       idVendor: item.idVendor,
      //       idOrder1: item.id,
      //       idCompany_payment: 0,
      //       revision: result.data.revision,
      //       billNumber: item.orderNumber,
      //       sentDate: item.invoicedDate,
      //       dueDate: item.indvoicedueDate,
      //       paymentTerms: '',
      //       amount: item.remainingAmount,
      //       txtNotes: item.notes,
      //       billyn: true,
      //       costCode: item.costCode,
      //       paymentFiles: [],
      //       idInvitedCompany: 0,
      //       vendorName: item.vendorName,
      //       vendorEmail: '',
      //       status: '',
      //       account: '',
      //       payType: '',
      //     };
      //     this.getPaymentList();
      //     this.confirmModalRef.close();
      //   },
      //   (reason) => {
      //     console.log(reason);
      //   }
      // );
    }
  }
  
  getPaymentList(){
    this.apolloService.query(companypayment_list, {
      idCompany: parseInt(this.localStorage.getItem('idcompany'))
    }).then((res) => {
      const result = res.companypayment_list;
      if(!result.error){
        this.paymentList = result.data;
      }
    });
  }
  
  openPayingBill(){
    if(this.paymentList.length == 0){
      this.toastrService.info(
        'No payment method available, please go to company settings and add a new payment method.',
        'Warning',
        {
          timeOut: 6000,
          enableHtml: true,
          toastClass: 'max-width-300 text-white'
        }
      );
    } else{
      this.payingBillModalRef = this.modalService.open(this.payingBillModal, {
        backdrop: 'static',
        modalDialogClass: 'modal-right',
        size: '640'
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
  
  openPaymentRequestModal(order, event){
    if(order.pendingAmount == 0){
      this.selectedOrder = order;
      this.paymentRequestModalRef = this.modalService.open(
        this.paymentRequestModal,
        {
          backdrop: 'static',
          modalDialogClass: 'modal-right',
          size: '640'
        }
      );
      this.paymentRequestModalRef.result.then(
        (res) => {
          this.getOrders();
        },
        (dismiss) => {
          this.getOrders();
        }
      );
      event.stopPropagation();
    }else {
      this.toastrService.info('Another request is pending on this order.','')
    }
  }
  
  protected readonly globalFunc = this.globalFuns;
}
