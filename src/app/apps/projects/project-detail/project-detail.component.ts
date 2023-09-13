import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  companyproject_info,
  projectbudget_list,
} from 'src/app/core/gql/project';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent {
  tabs = 1;
  keywords = '';

  project = {
    id: 0,
    revision: 0,
    idCompany: 0,
    projectName: '',
    projectAddress: '',
    projectBudget: 0.0,
    projectSqft: 0.0,
    idGroup: 0,
    groupName: '',
    idCompany_payment: 0,
    color: '',
    icon: '',
    pinyn: false,
    status: '',
    active: false,
    canDelete: false,
  };

  budgetList = [];
  isLoading = true;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const idProject = parseInt(params['id']);
      this.getProjectInfo(idProject);
      this.getProjectBudgetList(idProject);
    });
  }

  getProjectInfo(id) {
    this.apolloService.query(companyproject_info, { id: id }).then((res) => {
      const result = res.companyproject_info;
      if (!result.error) {
        this.project = result.data;
      }
    });
  }

  getProjectBudgetList(id) {
    this.apolloService
      .query(projectbudget_list, { idProject: id })
      .then((res) => {
        const result = res.projectbudget_list;
        if (!result.error) {
          this.budgetList = result.data;
        }
        this.isLoading = false;
      });
  }
}
