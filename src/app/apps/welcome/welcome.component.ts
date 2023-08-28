import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  @ViewChild('welcomeModal') welcomeModal: any;
  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.openVerticallyCentered(this.welcomeModal);
    }, 30);
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, {
      size:'443',
      centered: true,
    });
  }

  goto(){
    this.modalService.dismissAll();
    localStorage.setItem('welcomeyn', 'false');
    this.router.navigate(['apps/company'])
  }
  
}
