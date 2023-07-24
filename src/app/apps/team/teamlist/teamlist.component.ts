import { Component } from '@angular/core';
import { company_members } from 'src/app/core/gql/team';
import { ApolloService } from 'src/app/core/service/apollo.service';
@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: ['./teamlist.component.scss'],
})
export class TeamlistComponent {
  statusFilter: string = 'All';
  members = [];
  
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
        if(!result.error){
          this.members = result.data;
        }
      });
  }
}
