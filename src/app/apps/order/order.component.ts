import { Component } from '@angular/core';
import { APPROVALAMOUNT } from '../../core/constants/members';
import { ApolloService } from '../../core/service/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { projectorder_list, projectorder_uploadfiles, projectorder_deletefile } from '../../core/gql/orders'
import { SweetAlertOptions } from 'sweetalert2';
import { Base } from 'src/app/core/base';
import { Router } from '@angular/router';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import { HttpService } from "../../core/service/http.service";
import { company_roles } from "../../core/gql/company";


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends Base {
  statusFilter: string = 'All';
  orders = [];
  currentOrderId: number = 0;
  uploadUrl = '';
  
  
  
  COMPANY_MEMBERS = [];
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info',
  ];
  allCount: number = 0;
  activeCount: number = 0;
  pendingCount: number = 0;
  showCount: number = 0;
  keywords = '';
  roleItems = [];
  direction = 'asc';
  sortCloumn = '';
  companyName = '';
  idUser = '';
  approvalAmount = APPROVALAMOUNT;
  editFlag: boolean = true;
  edit = [];
  approvalAmountFilter = 'Approval Amount';
  roleFilter = 'Approval';
  loading = true;

  canEdit = false;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService,
    private router: Router
  ) {
    super();
  }

  pushEditArray(info) {
    let item = this.edit.find((item) => item.id == info.id);
    if (item) {
      item = info;
    } else {
      this.edit.push(info);
    }
  }

  changeStatusFilter(filter: string) {
    this.statusFilter = filter;
    this.orders = this.COMPANY_MEMBERS;
    this.showCount = this.allCount;
    if (filter == 'Active') {
      this.orders = this.orders.filter(
        (member) => member.active && member.idUser > 0
      );
      this.showCount = this.activeCount;
    } else if (filter == 'Pending') {
      this.orders = this.orders.filter((member) => member.idUser == 0);
      this.showCount = this.pendingCount;
    }
  }

  changeRoleFilter(filter: string) {
    this.roleFilter = filter;
    this.orders = this.COMPANY_MEMBERS;
    if (filter != 'All') {
      this.orders = this.orders.filter((member) => member.role == filter);
    }
  }

  changeapprovalAmountFilter(filter: string) {
    this.approvalAmountFilter = filter;
    this.orders = this.COMPANY_MEMBERS;
    if (filter != 'All') {
      this.orders = this.orders.filter(
        (member) => member.approvalAmount == filter
      );
    }
  }

  ngOnInit(): void {
    this.canEdit = super.setRole('Manage company users');
    this.apolloService.query(company_roles, {
      idCompany: parseInt(localStorage.getItem('idcompany')),
    }).then((res) => {
      const result = res.company_roles;
      if (!result.error) {
        this.roleItems = result.data.map((item) => {
          return Object.assign(
            {},
            {
              id: item.idRole,
              text: item.txtName,
            }
          );
        });
      }
    });
    this.getOrders();
  }

  getOrders() {
    if (localStorage.getItem('idcompany')) {
      this.apolloService
        .query(projectorder_list, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
          idProject: 0
        })
        .then((res) => {
          const result = res.projectorder_list;
          if (!result.error) {
            this.orders = result.data;
            this.COMPANY_MEMBERS = JSON.parse(JSON.stringify(result.data));

            this.allCount = result.data.length;
            this.showCount = this.allCount;
            this.loading = false;
          }
        });
    }
  }
  
  uploadFile(event) {
    const file = event.target.files[0];
    if (file) {
      const fileName = getNewFileName(file.name);
      file.filename = fileName;
      this.apolloService
      .query(get_file_url, { fileName: fileName, folder: 'files' })
      .then((res) => {
        if (!res.get_file_url.error) {
          this.uploadUrl = res.get_file_url.data;
          this.httpService.put(this.uploadUrl, file).then((res) => {
            this.apolloService.mutate(projectorder_uploadfiles, {
              idCompany: localStorage.getItem('idcompany'),
              idOrder1: this.currentOrderId,
              orderfile: {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name
                .substring(file.name.lastIndexOf('.') + 1)
                .toLowerCase(),
                fileUrl: this.uploadUrl.split('?')[0],
              },
            })
            .then((res) => {
              const result = res.projectorder_uploadfiles;
              let message = '';
              if (!result.error) {
                message = 'Upload successful';
              } else {
                message = result.message;
              }
              this.toastrService.info(message, '');
            });
          });
        }
      });
    }
  }

  public alertOption: SweetAlertOptions = {};


  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(column: string): void {
    this.sortCloumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.orders = [...this.orders].sort((a, b) => {
      const res = this.compare(a[this.sortCloumn], b[this.sortCloumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

  filterTable = (member: any) => {
    let values = Object.values(member);
    return values.some(
      (v) =>
        member.firstName.toLowerCase().includes(this.keywords.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  };

  openDetail(id) {
    this.router.navigate(['apps/order/detail/' + id]);
  }
}
