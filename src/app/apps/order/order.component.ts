import { Component, ViewChild } from '@angular/core';
import { ApolloService } from '../../core/service/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { projectorder_list } from '../../core/gql/orders';
import { SweetAlertOptions } from 'sweetalert2';
import { Base } from 'src/app/core/base';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../core/service/http.service';
import { company_roles } from '../../core/gql/company';
import { GlobalFunctionsService } from '../../core/service/global-functions.service';
import { companyproject_list } from 'src/app/core/gql/project';
import { projectorder_duplicate } from 'src/app/core/gql/order';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { companypayment_list } from 'src/app/core/gql/payment';
import { projectpayment_new } from 'src/app/core/gql/receivables';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends Base {
  @ViewChild('confirmModal') confirmModal: any;
  @ViewChild('payingBill') payingBillModal: any;
  statusFilter: string = 'Active';
  roleFilter = 'Approval';

  orders = [];
  currentOrderId: number = 0;
  uploadUrl = '';
  scrollOptions = {
    forceVisible: true,
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
    'bg-info',
  ];
  keywords = '';
  direction = 'asc';
  sortColumn = '';
  edit = [];
  loading = true;
  tabs1 = 1;
  canEdit = false;
  
  listStatusCount: any;
  objectKeys = Object.keys;

  constructor(
    private apolloService: ApolloService,
    private router: Router,
    private globalFuns: GlobalFunctionsService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private localStorage: LocalStorageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.listStatusCount = {...this.globalFuns.OPStatusCount};
    const tab = this.activatedRoute.snapshot.queryParams['tab'];
    this.canEdit = super.setRole('Manage company users');
    if (tab) {
      this.tabs1 = 2;
    }

    if (this.localStorage.getItem('idcompany')) {
      this.getOrders();
      this.getRoles();
      this.getProjects();
    } else {
      this.loading = false;
    }
  }

  getOrders() {
    if (this.localStorage.getItem('idcompany')) {
      this.apolloService
        .query(projectorder_list, {
          idCompany: parseInt(this.localStorage.getItem('idcompany')),
          idProject: 0,
        })
        .then((res) => {
          const result = res.projectorder_list;
          if (!result.error) {
            this.orders = result.data;
            this.InitialOrders = JSON.parse(JSON.stringify(result.data));
            this.getStatusCount();
            this.loading = false;
          }
        });
    }
  }

  getRoles() {
    this.apolloService
      .query(company_roles, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.company_roles;
        if (!result.error) {
          this.roles = JSON.parse(JSON.stringify(result.data));
          this.roles.map((role) => {
            role['id'] = role.idRole;
            role['checked'] = true;
          });
          this.roles.unshift({
            id: 'all',
            txtName: 'All',
            checked: true,
          });
        }
      });
  }

  getProjects() {
    this.apolloService
      .query(companyproject_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companyproject_list;
        if (!result.error) {
          this.projects = JSON.parse(JSON.stringify(result.data));
          this.projects.map((project) => (project['checked'] = true));
          this.projects.unshift({
            id: 'all',
            projectName: 'All',
            checked: true,
          });
        }
      });
  }

  getStatusCount() {
    let listStatusCount = {...this.globalFuns.OPStatusCount};
    
    this.InitialOrders.map((invoice) => {
      if(!listStatusCount[invoice.status]){
        listStatusCount[invoice.status]=0;
      }
      listStatusCount[invoice.status]++;
    })
    this.listStatusCount = listStatusCount;
  }

  statusFilterChange(e, status, type) {
    if (this[type] === status) {
      setTimeout(() => {
        e.target.checked = true;
      }, 50);
    }
    this[type] = status;
  }

  filterChange(item, type) {
    if (item.id == 'all') {
      this[type].map((item) => {
        item.checked = this[type][0].checked;
      });
    } else {
      let itemsCheckedCount = 0;
      this[type].map((item) => {
        if (item.id != 'all' && item.checked) {
          itemsCheckedCount++;
        }
      });
      this[type][0].checked = itemsCheckedCount == this[type].length - 1;
    }
  }

  changeRoleFilter(filter: string) {
    this.roleFilter = filter;
    this.orders = this.InitialOrders;
    if (filter != 'All') {
      this.orders = this.orders.filter((member) => member.role == filter);
    }
  }

  public alertOption: SweetAlertOptions = {};

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
    if ((this.statusFilter !== 'Active' && order.status != this.statusFilter) || (this.statusFilter == 'Active' && order.status == 'Paid')) {
      return false;
    }
    if (
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
    ) {
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

  duplicateOrder(id, idVendor, revision) {
    if (id > 0) {
      this.apolloService
        .mutate(projectorder_duplicate, {
          idCompany: parseInt(this.localStorage.getItem('idcompany')),
          idVendor: idVendor,
          id: id,
          revision: revision,
        })
        .then((res) => {
          let result = res.projectorder_duplicate;
          let message = '';
          if (!result.error) {
            message = 'Duplicate successful';
            this.router.navigate(['apps/order/detail/' + result.data.id]);
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '', {
            positionClass: 'toast-top-right-order',
          });
        });
    }
  }

  confirmModalRef;

  selectItem;
  openConfirmModal(item) {
    this.selectItem = item;
    this.confirmModalRef = this.modalService.open(this.confirmModal, {
      backdrop: 'static',
      size: '443',
      centered: true,
    });

    this.confirmModalRef.result.then(
      (res) => {},
      (dismiss) => {}
    );
  }

  cancelConfirm() {
    this.confirmModalRef.close();
  }
  projectpayment;
  vendor;
  PayBill() {
    this.vendor = {
      id: this.selectItem.idVendor,
      vendorName: this.selectItem.vendorName,
    };
    this.projectpayment = {
      idCompany: this.selectItem.idCompany,
      idProject: this.selectItem.idProject,
      idVendor: this.selectItem.idVendor,
      idOrder1: this.selectItem.id,
      idCompany_payment: 0,
      billNumber: this.selectItem.orderNumber,
      sentDate: this.selectItem.invoicedDate,
      dueDate: this.selectItem.indvoicedueDate,
      paymentTerms: '',
      amount: this.selectItem.remainingAmount,
      txtNotes: this.selectItem.notes,
      billyn: true,
      costCode: this.selectItem.costCode,
      paymentFiles: [],
      idInvitedCompany: 0,
      vendorName: this.selectItem.vendorName,
      vendorEmail: '',
      status: '',
      account: '',
      payType: '',
    };

    if (this.projectpayment.amount > 0) {
      this.apolloService
        .mutate(projectpayment_new, this.projectpayment)
        .then((res) => {
          const result = res.projectpayment_new;
          this.projectpayment.id = result.data.id;
          this.projectpayment.revision = result.data.revision;
          this.getPaymentList();
          this.confirmModalRef.close();
        });
    } else {
      this.toastrService.info('Please enter amount', '');
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

  payingBillModalRef;
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
          console.log('OK');
        },
        (dismiss) => {
          console.log('dismiss');
        }
      );
    }
  }
}
