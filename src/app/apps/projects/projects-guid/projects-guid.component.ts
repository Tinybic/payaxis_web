import { Component, ViewChild } from '@angular/core';
import { JoyrideService } from 'ngx-joyride';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";


@Component({
    selector: 'app-projects-guid',
    templateUrl: './projects-guid.component.html',
    styleUrls: ['./projects-guid.component.scss']
})
export class ProjectsGuidComponent {
    @ViewChild('niceWorkModal') niceWorkModal: NgbModalRef;
    
    constructor(
        private readonly joyrideService: JoyrideService,
        private modalService: NgbModal,
        private router: Router
    ){ }
    
    ngOnInit(): void{
        if(localStorage.getItem('welcomeyn') == 'false'){
            this.router.navigate(['apps/projects']);
        }
        
        this.joyrideService.startTour({
                steps: ['budget',
                    'secondStep',
                    'thirdStep'],
                showCounter: false,
                themeColor: '#000000'
            } // steps order
        );
    }
    
    tourList = [{
        target: 'Budget',
        top: '212px',
        left: '178px',
        height: '184px',
        title: 'Project Navigation',
        content: 'On the project dashboard you can see all financial changes.',
        dot: 0,
        buttonText: 'Got it'
    },
        {
            target: 'Bills',
            top: '212px',
            left: '264px',
            height: '232px',
            title: 'Project Bills',
            content: 'In each project you can view and manage the list of Bills. And also see the entire history of the every Invoice.',
            dot: 1,
            buttonText: "It's clear"
        },
        {
            target: 'Vendors&Team',
            top: '212px',
            left: '332px',
            height: '232px',
            title: 'Users Profile',
            content: 'You can find all information about your teammates and vendors assigned to the project.',
            dot: 2,
            buttonText: "It's clear"
        },
        {
            target: 'Projects',
            top: '78px',
            left: '188px',
            height: '184px',
            title: 'Projects',
            content: 'Quickly view and manage all projects.',
            dot: 4,
            buttonText: "OK"
        },
        {
            target: 'All Vendors',
            top: '182px',
            left: '188px',
            height: '184px',
            title: 'All Vendors',
            content: 'Quick access to the list of all vendors.',
            dot: 4,
            buttonText: "Got it"
        },
        {
            target: 'Team list',
            top: '234px',
            left: '188px',
            height: '184px',
            title: 'Team list',
            content: "Stay up to date on your team members' work.",
            dot: 4,
            buttonText: "Finish"
        }]
    
    
    currentTourStep = 0;
    currentTour = this.tourList[this.currentTourStep];
    
    nextStep(){
        if(this.currentTourStep < 6){
            this.currentTourStep++;
            this.currentTour = this.tourList[this.currentTourStep];
            if(this.currentTourStep > 5){
                this.modalService.open(this.niceWorkModal, {
                    backdrop: 'static',
                    centered: true,
                    windowClass: 'centerModal'
                });
            }
        }
    }
    
    getStarted(){
        this.modalService.dismissAll();
        localStorage.setItem('welcomeyn', 'false')
        this.router.navigate(['apps/projects']);
    }
}
