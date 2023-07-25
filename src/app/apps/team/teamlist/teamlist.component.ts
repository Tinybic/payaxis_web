import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { company_members } from 'src/app/core/gql/team';
import { CompanyMembers } from 'src/app/core/models/companyMember.models';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { STEP1 } from './html/step1.modal';
@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.scss'],
})
export class TeamlistComponent {
  @ViewChild('step1') step1: any;

  statusFilter: string = 'All';
  members = [];
  COMPANY_MEMBERS = [];
  columns: Column[] = [];

  allCount: number = 0;
  activeCount: number = 0;
  pendingCount: number = 0;
  items;
  step1html: any;
  keywords:string = '';

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal
  ) {
    this.step1html = STEP1;
  }

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
    console.log(event)
    if (event.direction === '') {
      this.members = this.COMPANY_MEMBERS;
    } else {
      this.members = [...this.members].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }


  searchTable(){
    this.members = this.COMPANY_MEMBERS;
    this.members = this.members.filter((member) => member.firstName.toLowerCase().includes(this.keywords.toLowerCase()) || member.lastName.toLowerCase().includes(this.keywords.toLowerCase()));
  }


  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { size: '443', centered: true });
  }

  inviteMembers() {
    this.openVerticallyCentered(this.step1);
  }
}
