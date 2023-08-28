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


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @ViewChild('joinUsModal') joinUsModal: NgbModalRef;
  projects: Project[] = [];
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService
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
  
  /**
   * fetches data
   */
  _fetchData(): void{
    this.projects = PROJECTS;
  }
  
  
  goNext(){
    this.modalService.dismissAll();
    this.router.navigate(['apps/projects/guid']);
  }
}
