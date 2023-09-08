import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
// constants
import { EventType } from 'src/app/core/constants/events';

// services
import { EventService } from 'src/app/core/service/event.service';

import { companyproject_list, companygroup_list, companyproject_pin } from '../../core/gql/project';
import { ApolloService } from '../../core/service/apollo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @ViewChild('joinUsModal') joinUsModal: NgbModalRef;
  @ViewChild('createProjectModal') createProjectModal: NgbModalRef;
  @ViewChild('newGroupModal') newGroupModal: NgbModalRef;
  @ViewChild('selectColor') selectColor: NgbModalRef;

  modalRef: any;
  isLoading = true;
  projectList: any[] = [];
  groupedProjectList: any;
  companyGroupList = [];
  idProject = 0;
  idCompany = 0;
  keywords = '';
  groupedProjects: any[] = [];
  selectedGroup = {
    idGroup: 0,
    txtName: '',
    projectCount: 0,
  };

  newGroupModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.eventService.broadcast(EventType.CHANGE_PAGE_TITLE, {
      title: 'Projects',
      breadCrumbItems: [
        {
          label: 'Apps',
          path: '.',
        },
        {
          label: 'Projects',
          path: '.',
          active: true,
        },
      ],
    });
    if (localStorage.getItem('welcomeyn') === 'true') {
      this.isLoading = false;
      setTimeout(() => {
        this.modalService.open(this.joinUsModal, {
          backdrop: 'static',
          centered: true,
          windowClass: 'centerModal',
        });
      }, 30);
    } else {
      setTimeout(() => {
        this.idCompany = parseInt(localStorage.getItem('idcompany'));
        this.getProjectList();
        this.getCompanyGroupList();
      }, 500);
    }
  }

  getProjectList() {
    if (this.idCompany != 0) {
      this.apolloService
        .query(companyproject_list, { idCompany: this.idCompany })
        .then((res) => {
          const result = res.companyproject_list;
          if (!result.error) {
            this.projectList = result.data;
          }

          this.groupedProjects = this.projectList.reduce((acc, project) => {
            const group = acc[project.idGroup] || [];
            group.push(project);
            acc[project.idGroup] = group;
            return acc;
          }, {});
          this.groupedProjectList = Object.values(this.groupedProjects)[0];
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

  getCompanyGroupList() {
    if (this.idCompany != 0) {
      this.apolloService
        .query(companygroup_list, { idCompany: this.idCompany })
        .then((res) => {
          const result = res.companygroup_list;
          if (!result.error) {
            this.companyGroupList = result.data;

            this.selectedGroup = {
              idGroup: this.companyGroupList[0].id,
              txtName: this.companyGroupList[0].txtName,
              projectCount: this.companyGroupList[0].projectcount,
            };
          }
        });
    }
  }

  filterPinProjectList = (project) => {
    return project.pinyn;
  };

  createProject(idProject) {
    this.idProject = idProject;
    this.modalRef = this.modalService.open(this.createProjectModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static',
    });

    this.modalRef.result.then(
      (result) => {
        // get projects
        this.getProjectList();
        this.getCompanyGroupList();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  selectGroupProject(group) {
    this.selectedGroup = {
      idGroup: group.id,
      txtName: group.txtName,
      projectCount: group.projectcount,
    };

    Object.keys(this.groupedProjects).map((key) => {
      if (key == group.id) {
        this.groupedProjectList = this.groupedProjects[key];
      }
    });
  }

  newGroup() {
    this.newGroupModalRef = this.modalService.open(this.newGroupModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static',
    });

    this.newGroupModalRef.result.then(
      (result) => {
        this.getCompanyGroupList();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  goNext() {
    this.modalService.dismissAll();
    this.router.navigate(['apps/projects/guid']);
  }


  pinProject(item,pinyn){
    this.apolloService
    .mutate(companyproject_pin, {
      id: item.id,
      revision: item.revision,
      pinyn: pinyn
    })
    .then((res) => {
      const result = res.companyproject_pin;
      let message = '';
      if (!result.error) {
        message = 'Project pin have been updated';
      } else {
        message = result.message;
      }
      this.getProjectList();
      this.toastrService.info(message, '');
    });
  }



  colorRef;
  colorSelectItem;
  openSetColor(item) {
    this.colorRef = this.modalService.open(this.selectColor, {
      size: '280',
      centered: true,
      backdrop: 'static',
    });
    this.colorSelectItem = item;


    this.colorRef.result.then(
      (result) => {
        // get projects
        this.getProjectList();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
