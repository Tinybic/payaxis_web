import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// service
import { ApolloService } from 'src/app/core/service/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// types
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;

  signUpForm2: UntypedFormGroup = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  formSubmitted: boolean = false;
  loading: boolean = false;
  error: string = '';


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private apolloService: ApolloService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm2.controls;
  }

  onCodeChanged(code: string) {
  }

  onCodeCompleted(code: string) {
  }
  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }
  /**
   * On form submit
   */
  paracont = '59';
  onSubmit(): void {
    this.formSubmitted = true;
    this.openVerticallyCentered(this.centeredModal);

    let that = this;
    
    const numbers = interval(1000);
    const takeFourNumbers = numbers.pipe(take(58));
    takeFourNumbers.subscribe({
      next(x): any {
        that.paracont = "Resend code in 00:" + (58-x);
      },
      error(err): any {},
      complete(): any{
        that.paracont = "Resend";
      }
    });

    // if (this.signUpForm.valid) {
    //   this.loading = true;
    //   this.apolloService
    //     .mutate(SignupStep1, {
    //       email: this.formValues['email'].value,
    //       password: this.formValues['password'].value,
    //     })
    //     .then((res) => {
    //       const result = res.user_account_add;

    //       this.loading = false;
    //     })
    //     .catch((error) => {
    //       this.error = error;
    //     });
    // }
  }
}
