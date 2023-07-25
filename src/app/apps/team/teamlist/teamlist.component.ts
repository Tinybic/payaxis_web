import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { company_members } from 'src/app/core/gql/team';
import { CompanyMembers } from 'src/app/core/models/companyMember.models';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';

@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.scss'],
})
export class TeamlistComponent {
  @ViewChild('inviteMember') inviteMember: any;

  statusFilter: string = 'All';
  members = [];
  COMPANY_MEMBERS = [];
  columns: Column[] = [];
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
  emailList = [
    'wfszwk@qq.com',
    'wfszw1k@qq.com',
    'wfszw2k@qq.com',
    'wfszw3k@qq.com',
  ];
  step: string = 'step1';
  keywords: string = '';
  userList = [];

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal
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
          this.initTableCofig();
        }
      });
  }

  initTableCofig(): void {
    this.columns = [
      {
        name: 'firstName',
        label: 'User',
        formatter: (member: CompanyMembers) => {
          let result = `<div class="d-flex flex-row">
          <div class="me-1-1"><img src="/assets/images/users/profile.jpg" alt="user-img"
                  title="Mat Helme" class="rounded-circle img-thumbnail avatar-md-1"></div>
          <div>`;
          result +=
            '<div class="bold-600">' +
            member.firstName +
            '&nbsp;' +
            member.lastName +
            '</div>';
          result += ` <div class="text-typeblackdeactivated">ManagerSales</div>
          </div>
          </div>`;
          return result;
        },
      },
      {
        name: 'position',
        label: 'Role',
        formatter: (member: CompanyMembers) => member.role,
      },
      {
        name: 'office',
        label: 'Office',
        formatter: (member: CompanyMembers) => member.approvalAmount,
        width: 180,
      },
      {
        name: 'age',
        label: 'Status',
        formatter: (member: CompanyMembers) => member.active,
      },
    ];
  }

  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(event: SortEvent): void {
    if (event.direction === '') {
      this.members = this.COMPANY_MEMBERS;
    } else {
      this.members = [...this.members].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
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
        approvalAmount: 'Approval Limit',
      });
    });

    if (this.userList.length > 0) this.step = 'step3';
  }

  step3Approval(item, select) {
    console.log(item);
    console.log(select);
    item.approvalAmount = select;
  }
  step3Role(item, idrole, role) {
    item.idMasterRole = idrole;
    item.role = role;
  }
  send(){

  }
}
