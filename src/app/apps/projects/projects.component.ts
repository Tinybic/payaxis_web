import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
// constants
import { EventType } from 'src/app/core/constants/events';

// services
import { EventService } from 'src/app/core/service/event.service';

// types
import { Project } from './projects.model';

// data
import { PROJECTS } from './data';
import { companyproject_list } from "../../core/gql/project";
import { ApolloService } from "../../core/service/apollo.service";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @ViewChild('joinUsModal') joinUsModal: NgbModalRef;
  @ViewChild('createProjectModal') createProjectModal: NgbModalRef;
  
  
  modalRef: any;
  projects: any[] = [];
  idProject=0;
  idCompany = 0;
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
  ){ }
  
  ngOnInit(): void{
    this.eventService.broadcast(EventType.CHANGE_PAGE_TITLE, {
      title: "Projects",
      breadCrumbItems: [{
        label: 'Apps',
        path: '.'
      },
        {
          label: 'Projects',
          path: '.',
          active: true
        }]
    });
    this._fetchData();
    if(localStorage.getItem('welcomeyn') === 'true'){
      setTimeout(() => {
        this.modalService.open(this.joinUsModal, {
          backdrop: 'static',
          centered: true,
          windowClass: 'centerModal'
        });
      }, 30);
    }
  }
  
  
  getCategoryList(){
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
    if(this.idCompany != 0){
      this.apolloService.query(companyproject_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companycategory_list;
        if(!result.error){
          this.projects = result.data;
        }
      });
    }
  }
  
  /**
   * fetches data
   */
  _fetchData(): void{
    this.projects = PROJECTS;
  }
  
  
  createProject(idProject){
    this.idProject = idProject;
    this.modalRef = this.modalService.open(this.createProjectModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    })
  
    this.modalRef.result.then((result) => {
      // get projects
      
      console.log('get projects')
    }, (reason) => {
      console.log(reason);
    })
  }
  
  
  goNext(){
    this.modalService.dismissAll();
    this.router.navigate(['apps/projects/guid']);
  }
}
