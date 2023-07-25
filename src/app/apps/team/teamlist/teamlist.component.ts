import { Component } from '@angular/core';
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
  statusFilter: string = 'All';
  members = [];
  COMPANY_MEMBERS = [];
  columns: Column[] = [];

  constructor(private apolloService: ApolloService) {}

  changeStatusFilter(filter: string) {
    this.statusFilter = filter;
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
          this.initTableCofig();
        }
      });
  }

  initTableCofig(): void {
    this.columns = [
      {
        name: 'name',
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
}
