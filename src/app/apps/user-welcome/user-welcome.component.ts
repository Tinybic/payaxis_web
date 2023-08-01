import {Component, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.scss']
})
export class UserWelcomeComponent {
  @ViewChild('joinUsModal') joinUsModal: NgbModalRef;
  constructor(
      private modalService: NgbModal,
      private router: Router,
  ){}
  
  ngOnInit(): void {
    setTimeout(() => {
      this.modalService.open(this.joinUsModal, { backdrop: 'static', centered: true, windowClass: 'centerModal' });
    }, 30);
  }
  
  goNext(){
    this.modalService.dismissAll();
    this.router.navigate(['apps/user-welcome-guid']);
  }
}
