import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TypedDocumentNode } from '@apollo/client';
// constants
import { EventType } from 'src/app/core/constants/events';

// services
import { EventService } from 'src/app/core/service/event.service';
import { GlobalFunctionsService } from '../../core/service/global-functions.service';

import {
  companyproject_list,
  companyproject_pin,
  companyproject_moveto,
  companyproject_delete,
  companyproject_deactivate,
  companygroup_list,
  companygroup_update,
  companygroup_deactivate
} from '../../core/gql/project';
import { ApolloService } from '../../core/service/apollo.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Base } from 'src/app/core/base';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends Base implements OnInit {
  @ViewChild('joinUsModal') joinUsModal: NgbModalRef;
  @ViewChild('welcomeModal') welcomeModal: NgbModalRef;
  @ViewChild('createProjectModal') createProjectModal: NgbModalRef;
  @ViewChild('newGroupModal') newGroupModal: NgbModalRef;
  @ViewChild('confirmModal') deleteModal: NgbModalRef;
  @ViewChild('infoModal') infoModal: NgbModalRef;
  @ViewChild('selectColor') selectColor: NgbModalRef;
  @ViewChild('deleteProjectModal') deleteProjectModal: NgbModalRef;
  
  subscription: Subscription;
  
  modalRef: any;
  isLoading = true;
  projectList: any[] = [];
  companyGroupList = [];
  idCompany = 0;
  keywords = '';
  selectedGroup = {
    id: 'all',
    txtName: 'All',
    checked: true,
    projectcount: 0
  };
  group: any;
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  deleteObj = {
    title: '',
    message: '',
    btnConfirm: '',
    serviceName: {},
    params: {}
  };
  
  infoObj = {
    title: '',
    message: '',
    btnOK: ''
  };
  
  createProjectWithGroup;
  
  newGroupModalRef: NgbModalRef;
  deleteModalRef: NgbModalRef;
  infoModalRef: NgbModalRef;
  
  showNewProject = false;
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private globalService: GlobalFunctionsService,
    private localStorage: LocalStorageService
  ){
    super();
  }
  
  ngOnInit(): void{
    if(this.localStorage.getItem('companyAccess')){
      this.showNewProject = super.setRole('Create Projects');
    } else{
      let cnt = 0;
      const intervalID = setInterval(() => {
        if(this.localStorage.getItem('companyAccess')){
          this.showNewProject = super.setRole('Create Projects');
          clearInterval(intervalID);
        } else{
          if(cnt > 2){
            clearInterval(intervalID);
          }
          cnt++;
        }
      }, 500)
    }
    this.eventService.broadcast(EventType.CHANGE_PAGE_TITLE, {
      title: 'Projects',
      breadCrumbItems: [
        {
          label: 'Apps',
          path: '.'
        },
        {
          label: 'Projects',
          path: '.',
          active: true
        }
      ]
    });
    if(this.localStorage.getItem('welcomeyn') === 'true'){
      this.isLoading = false;
      if(this.localStorage.getItem('memberyn') === 'true'){
        setTimeout(() => {
          this.modalService.open(this.joinUsModal, {
            backdrop: 'static',
            centered: true,
            windowClass: 'centerModal'
          });
        }, 30);
      } else{
        setTimeout(() => {
          this.modalService.open(this.welcomeModal, {
            backdrop: 'static',
            size: '443',
            centered: true
          });
        }, 30);
      }
    } else{
      if(this.localStorage.getItem('idcompany')){
        this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
        this.getProjectList();
        this.getCompanyGroupList('all');
      } else{
        this.subscription = this.globalService.companyID$.subscribe(
          (companyID) => {
            if(companyID !== 0){
              this.idCompany = companyID;
              this.getProjectList();
              this.getCompanyGroupList('all');
            }
          }
        );
      }
    }
  }
  
  getProjectList(){
    if(this.idCompany != 0){
      this.apolloService.query(companyproject_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companyproject_list;
        if(!result.error){
          this.projectList = result.data;
          this.projectList.forEach((item) => {
            if(item.projectBudget > 0)
              item.progress = (item.projectUsed / item.projectBudget) * 100;
            else item.progress = 0;
          });
        }
        this.isLoading = false;
      });
    } else{
      this.isLoading = false;
    }
  }
  
  getCompanyGroupList(id){
    if(this.idCompany != 0){
      this.apolloService.query(companygroup_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companygroup_list;
        if(!result.error){
          this.companyGroupList = JSON.parse(JSON.stringify(result.data));
          
          this.companyGroupList.unshift({
            id: 'all',
            txtName: 'All',
            checked: false,
            projectCount: 0
          });
          this.companyGroupList.map((group) => {
            group.checked = id === group.id;
            if(id === group.id){
              this.selectedGroup = group;
            }
          });
        }
      });
    }
  }
  
  filterPinProjectList = (project) => {
    return project.pinyn;
  };
  
  createProject(group){
    if(group == ''){
      this.createProjectWithGroup = null;
    } else{
      this.createProjectWithGroup = {
        id: group.id,
        txtName: group.txtName
      };
    }
    this.modalRef = this.modalService.open(this.createProjectModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    
    this.modalRef.result.then(
      (result) => {
        // get projects
        this.getProjectList();
        this.getCompanyGroupList(this.selectedGroup.id);
      },
      (reason) => {
        console.log(reason);
        this.getCompanyGroupList(this.selectedGroup.id);
      }
    );
  }
  
  openGroupActionDropdown(e, i, groupActionDropdown){
    e.stopPropagation();
    let ele1 = document.getElementById('groupDropdownMenu');
    let ele = document.getElementById('groupActionDropdown');
    ele.style.left = ele1.offsetWidth + 8 + 'px';
    ele.style.top =
      ele1.childNodes[i]['offsetTop'] + 40 - ele1.scrollTop + 'px';
    setTimeout(() => {
      if(!groupActionDropdown.isOpen()){
        groupActionDropdown.open();
      }
    }, 20);
  }
  
  selectGroupProject(group){
    this.selectedGroup = group;
    setTimeout(() => {
      this.companyGroupList.map((item) => {
        item.checked = item.id == group.id;
      });
    }, 20);
  }
  
  filterGroupProjectList = (project) => {
    return (
      !project.pinyn &&
      (this.selectedGroup.id == 'all' ||
        project.idGroup == this.selectedGroup.id) &&
      (this.keywords == '' || project.includes(this.keywords))
    );
  };
  
  getGroupedProjectCount(group){
    let allGroupProjectsCount = 0;
    this.projectList.map((project) => {
      if(
        !project.pinyn &&
        (group.id == 'all' || project.idGroup == group.id)
      ){
        allGroupProjectsCount++;
      }
    });
    return allGroupProjectsCount;
  }
  
  newGroup(group){
    this.group = group;
    this.newGroupModalRef = this.modalService.open(this.newGroupModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    
    this.newGroupModalRef.result.then(
      (result) => {
        this.getCompanyGroupList(group.id);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  
  deleteGroup(group){
    this.deleteObj = {
      title: 'Delete Group',
      message:
        'All projects within this group will be moved to ungrouped category. Do you wish to proceed?',
      btnConfirm: 'Delete Group',
      serviceName: companygroup_deactivate,
      params: {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idCompany_group: group.id,
        revision: group.revision
      }
    };
    
    this.deleteModalRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true
    });
    this.deleteModalRef.result.then(
      (result) => {
        // this.companyGroupList.splice(i, 1);
        this.getCompanyGroupList('all');
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  
  goNext(){
    this.modalService.dismissAll();
    this.router.navigate(['apps/projects/guid']);
  }
  
  pinInfo(){
    this.infoObj = {
      title: 'Pin Project',
      message: 'Only 4 Projects could be pin to the top.',
      btnOK: 'Clear'
    };
    
    this.infoModalRef = this.modalService.open(this.infoModal, {
      size: '443',
      centered: true
    });
  }
  
  pinProject(item, pinyn){
    let pinProjectsLength = 0;
    this.projectList.map((item) => {
      if(item.pinyn){
        pinProjectsLength++;
      }
    });
    
    if(pinProjectsLength > 3 && pinyn){
      this.pinInfo();
    } else{
      this.apolloService.mutate(companyproject_pin, {
        idCompany: this.idCompany,
        id: item.id,
        pinyn: pinyn
      }).then((res) => {
        const result = res.companyproject_pin;
        let message = '';
        if(!result.error){
          message = 'Project pin have been updated';
        } else{
          message = result.message;
        }
        this.getProjectList();
        this.toastrService.info(message, '');
      });
    }
  }
  
  colorRef;
  colorSelectItem;
  
  openSetColor(item){
    this.colorRef = this.modalService.open(this.selectColor, {
      size: '280',
      centered: true,
      backdrop: 'static'
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
  
  projectMoveto(id, revision, idGroup){
    this.apolloService.mutate(companyproject_moveto, {
      idCompany: this.idCompany,
      id: id,
      revision: revision,
      idGroup: idGroup
    }).then((res) => {
      const result = res.companyproject_moveto;
      let message = '';
      if(!result.error){
        message = 'Project group have been updated';
        this.getProjectList();
        this.getCompanyGroupList('all');
      } else{
        message = result.message;
      }
      this.toastrService.info(message, '');
    });
  }
  
  projectDeleteRef;
  projectDeleteText = {
    title: 'Delete Project',
    message: 'Are you sure you want to delete this project?',
    btnDelete: 'Delete Project'
  };
  selectProjectId;
  selectProjectRevison;
  projectDeleteType;
  
  openProjectDeleteModal(id, revision, type){
    this.selectProjectId = id;
    this.selectProjectRevison = revision;
    this.projectDeleteType = type;
    if(type == 1){
      this.projectDeleteText = {
        title: 'Delete Project',
        message: 'Are you sure you want to delete this project?',
        btnDelete: 'Delete Project'
      };
    } else{
      this.projectDeleteText = {
        title: 'Archive Project',
        message:
          'This project has records tied to it and can only be archived.',
        btnDelete: 'Archive Project'
      };
    }
    this.projectDeleteRef = this.modalService.open(this.deleteProjectModal, {
      size: '483',
      centered: true,
      backdrop: 'static'
    });
  }
  
  projectDelete(){
    let gql = companyproject_delete;
    if(this.projectDeleteType == 0){
      gql = companyproject_deactivate;
    }
    this.apolloService.mutate(gql, {
      idCompany: this.idCompany,
      id: this.selectProjectId,
      revision: this.selectProjectRevison
    }).then((res) => {
      let result;
      if(this.projectDeleteType == 1){
        result = res.companyproject_delete;
      } else{
        result = res.companyproject_deactivate;
      }
      let message = '';
      if(!result.error){
        if(this.projectDeleteType == 1){
          message = 'Project have been deleted';
        } else{
          message = 'Project have been archived';
        }
        this.getProjectList();
        this.projectDeleteRef.close();
      } else{
        message = result.message;
      }
      this.toastrService.info(message, '');
    });
  }
  
  navProjectDetail(id){
    this.router.navigate(['/apps/projects/detail/' + id]);
  }
  
  goto(){
    this.modalService.dismissAll();
    this.localStorage.setItem('welcomeyn', 'false');
    this.router.navigate(['apps/setting']);
  }
}
