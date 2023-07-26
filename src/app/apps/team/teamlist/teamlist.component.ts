import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  company_members,
  company_member_invite,
  company_member_deactivate,
} from 'src/app/core/gql/team';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.scss'],
})
export class TeamlistComponent {
  @ViewChild('inviteMember') inviteMember: any;
  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;

  statusFilter: string = 'All';
  members = [];
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
  email: string = '';
  emailList = [];
  step: string = 'step1';
  keywords: string = '';
  userList = [];
  direction = 'asc';
  sortCloumn = '';
  companyName = '';

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  changeStatusFilter(filter: string) {
    this.statusFilter = filter;
    this.members = this.COMPANY_MEMBERS;
    if (filter == 'Active') {
      this.members = this.members.filter((member) => member.active);
    } else if (filter == 'Pending') {
      this.members = this.members.filter((member) => !member.active);
    }
  }

  ngOnInit(): void {
    this.companyName = localStorage.getItem('companyName');
    if (localStorage.getItem('idcompany')) {
      this.apolloService
        .query(company_members, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
        })
        .then((res) => {
          const result = res.company_members;
          if (!result.error) {
            this.members = result.data;
            this.COMPANY_MEMBERS = JSON.parse(JSON.stringify(result.data));

            this.allCount = result.data.length;
            this.activeCount = result.data.filter(
              (member) => member.active
            ).length;
            this.pendingCount = result.data.filter(
              (member) => !member.active
            ).length;
          }
        });
    }
  }

  public alertOption: SweetAlertOptions = {};
  deactive(id, firstName, lastName) {
    this.alertOption = {
      html:
        `<div>
      <div class="headline text-start">Deactivating the account</div>
      <div class="swal2-alert-content text-start">Do you want to deactivate <b>` +
        firstName +
        ' ' +
        lastName +
        `</b>?</div>
      </div>`,
      showCloseButton: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      width: 463,
      padding: 16,
      background: '#fff',
    };
    setTimeout(() => {
      this.ajaxRequest.fire().then((result) => {
        if (result.isConfirmed) {
          this.deactiveMembers(id);
        }
      });
    }, 100);
  }

  deactiveMembers(id) {
    this.apolloService
      .mutate(company_member_deactivate, { id: id })
      .then((res) => {
        let message = '';
        const result = res.company_member_deactivate;
        message = result.message;
        this.toastrService.info(message, '');
      });
  }

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

    this.members = [...this.members].sort((a, b) => {
      const res = this.compare(a[this.sortCloumn], b[this.sortCloumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

  searchTable() {
    this.members = this.COMPANY_MEMBERS;
    this.members = this.members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(this.keywords.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: '530', centered: true });
  }

  inviteMembers() {
    this.openVerticallyCentered(this.inviteMember);
  }

  isEmail(email: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return expression.test(email);
  }

  deleteEmail(index) {
    this.emailList.splice(index, 1);
  }

  step1() {
    this.emailList = this.email.split(',');
    this.emailList = this.emailList.filter((email) => this.isEmail(email));
    if (this.emailList.length > 0) this.step = 'step2';
  }

  step2() {
    this.userList = [];

    this.emailList.forEach((item) => {
      this.userList.push({
        email: item,
        idMasterRole: 0,
        role: 'View Only',
        approvalAmount: 0,
        approvalAmountText: 'Approval Limit',
      });
    });

    if (this.userList.length > 0) this.step = 'step3';
  }

  step3Approval(item, select, selectText) {
    item.approvalAmount = parseFloat(select);
    item.approvalAmountText = selectText;
  }
  step3Role(item, idrole, role) {
    item.idMasterRole = parseInt(idrole);
    item.role = role;
  }

  send() {
    this.modalService.dismissAll();
    const inviteMembers = this.userList.map((item) => {
      return Object.assign(
        {},
        {
          email: item.email,
          idMasterRole: item.idMasterRole,
          approvalAmount: item.approvalAmount,
        }
      );
    });

    const data = {
      idCompany: parseInt(localStorage.getItem('idcompany')),
      inviteMembers: inviteMembers,
    };

    this.apolloService.mutate(company_member_invite, data).then((res) => {
      let message = '';
      const result = res.company_member_invite;
      if (!result.error) {
        message = this.userList.length + ' invitation has been sent';
      } else {
        message = result.message;
      }
      this.toastrService.info(message, '');
    });
  }
}
