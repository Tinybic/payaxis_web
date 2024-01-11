import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'src/app/core/base';
import { EventType } from 'src/app/core/constants/events';
import {
  companyproject_info,
  projectbudget_list,
} from 'src/app/core/gql/project';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { EventService } from 'src/app/core/service/event.service';
import { companycategory_list, companycategory_new } from "../../../core/gql/costcode";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent extends Base {
  @ViewChild('editProjectModal') editProjectModal: NgbModalRef;
  @ViewChild('editBudgetModal') editBudgetModal: NgbModalRef;
  @ViewChild('addCategoryModal') addCategoryModal: any;
  tabs = 1;
  keywords = '';

  project = {
    id: 0,
    revision: 0,
    idCompany: 0,
    projectName: '',
    projectAddress: '',
    projectBudget: 0.0,
    projectUsed: 0.0,
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
  categoryName = '';
  categoryNameError = false;
  categoryList =[];

  editProjectModalRef: NgbModalRef;
  editBudgetModalRef: NgbModalRef;
  addCategoryModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) {super()}

  canEdit = false;
  canInviteMember = false;
  ngOnInit(): void {
    this.canEdit = super.setRole('Edit Projects');
    this.canInviteMember = super.setRole('Manage project users');
    this.activatedRoute.params.subscribe((params) => {
      const idProject = parseInt(params['id']);
      this.getProjectInfo(idProject);
      this.getProjectBudgetList(idProject);
      
      this.getCategoryList();
    });
  }

  getProjectInfo(id) {
    this.apolloService.query(companyproject_info, { id: id }).then((res) => {
      const result = res.companyproject_info;
      if (!result.error) {
        this.project = result.data;
        localStorage.setItem('projectName', this.project.projectName);
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

  editProjectDetails() {
    this.editProjectModalRef = this.modalService.open(this.editProjectModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static',
    });
    this.editProjectModalRef.result.then(
      (result) => {
        // get project
        this.getProjectInfo(this.project.id);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  editProjectBudget() {
    this.editBudgetModalRef = this.modalService.open(this.editBudgetModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static',
    });
    this.editBudgetModalRef.result.then(
      (result) => {
        // get project
        this.getProjectInfo(this.project.id);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  inviteMembers() {
    this.eventService.broadcast(EventType.PROJECT_DEDAIL_INVITE, true);
  }
  
  createNew(){
    if(this.tabs < 3){
      this.router.navigate(['apps/order/detail/-'+ this.project.id])
    }
  }
  
  
  openAddCategoryModal() {
    this.categoryNameError = false;
    this.addCategoryModalRef = this.modalService.open(this.addCategoryModal, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
    this.categoryName = '';
  }
  
  getCategoryList() {
    if (this.project.idCompany != 0) {
      this.apolloService
      .query(companycategory_list, { idCompany: this.project.idCompany })
      .then((res) => {
        const result = res.companycategory_list;
        if (!result.error) {
          this.categoryList = result.data;
        }
      });
    }
  }
  
  checkCategoryExist(name) {
    for (let i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].txtName == name) {
        return false;
      }
    }
    return true;
  }
  
  createCategory() {
    if (
      this.categoryName.toLocaleLowerCase() != 'others' &&
      this.checkCategoryExist(this.categoryName)
    ) {
      this.apolloService
      .mutate(companycategory_new, {
        idCompany: this.project.idCompany,
        txtName: this.categoryName,
      })
      .then((res) => {
        const result = res.companycategory_new;
        let message = '';
        if (!result.error) {
          message = 'Add category successfully';
          this.getCategoryList();
          this.addCategoryModalRef.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    } else {
      this.categoryNameError = true;
    }
  }
}
