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
import {
  profile_2fa,
  profile_activate,
  profile_info,
} from 'src/app/core/gql/user';
import { ToastrService } from 'ngx-toastr';
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
    phone: [''],
    f2_auth: [false],
  });

  formSubmitted: boolean = false;
  loading: boolean = false;
  error: string = '';

  mobile: string = '';
  revision: number = 1;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.apolloService
      .query(profile_info, {})
      .then((res) => {
        this.loading = false;

        const result = res.profile_info;
        if (!result.active) {
          this.formValues['firstname'].setValue(result.firstName);
          this.formValues['lastname'].setValue(result.lastName);
          this.formValues['companyName'].setValue(result.companyName);
          this.formValues['phone'].setValue(result.mobile);
          this.formValues['f2_auth'].setValue(result.twofa);
          this.revision = result.revision;
        } else {
          this.toastr.info(
            'This account has been activated. Please log in.',
            'Account information update.'
          );
          this.router.navigate(['auth/login']);
        }
      })
      .catch((err) => {
        this.loading = false;
      });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm2.controls;
  }

  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.modalService.dismissAll();
    this.loading = true;
    this.apolloService
      .mutate(profile_activate, {
        revision: this.revision,
        firstName: this.formValues['firstname'].value,
        lastName: this.formValues['lastname'].value,
        companyName: this.formValues['companyName'].value,
        mobile: this.formValues['phone'].value,
        twofa: this.formValues['f2_auth'].value,
        verificationCode: code,
      })
      .then((res) => {
        this.loading = false;
        if (!res.profile_activate.error) {
          this.router.navigate(['apps/welcome']);
        } else {
          this.error = res.profile_activate.message;
        }
      })
      .catch((err) => {
        this.loading = false;
      });
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  /**
   * On form submit
   */
  paracont: string = 'Resend';
  onSubmit(): void {
    this.error = '';
    this.formSubmitted = true;
    if (this.signUpForm2.valid) {
      if (this.formValues['f2_auth'].value) {
        if (this.paracont == 'Resend') {
          this.modalService.dismissAll();
          this.paracont = 'Resend code in 00:59';
          this.apolloService
            .mutate(profile_2fa, { mobile: this.formValues['phone'].value })
            .then((res) => {
              if (res.profile_2fa) {
                this.mobile = this.formValues['phone'].value;
                this.openVerticallyCentered(this.centeredModal);
                let that = this;
                const numbers = interval(1000);
                const takeFourNumbers = numbers.pipe(take(58));
                takeFourNumbers.subscribe({
                  next(x): any {
                    if (58 - x >= 10)
                      that.paracont = 'Resend code in 00:' + (58 - x);
                    else that.paracont = 'Resend code in 00:0' + (58 - x);
                  },
                  error(err): any {},
                  complete(): any {
                    that.paracont = 'Resend';
                  },
                });
              }
            });
        }
      } else {
        this.onCodeCompleted('0000');
      }
    }
  }
}
