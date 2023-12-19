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
import { HttpService } from 'src/app/core/service/http.service';
@Component({
  selector: 'app-auth-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;

  signUpForm2: UntypedFormGroup = this.fb.group({
    firstname: [''],
    lastname: [''],
    companyName: [''],
    phone: [''],
    f2_auth: [false],
  });

  formSubmitted: boolean = false;
  loading: boolean = false;
  error: string = '';
  phoneError = '';
  mobile: string = '';
  revision: number = 1;

  companyFlag = true;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.companyFlag = localStorage.getItem('join') == '0' ? true : false;
    if (!this.companyFlag) {
      this.toastr.info(
        `
          <div class="d-inline-block msssageIconDiv"><i class="fe-mail"></i></div>Please confirm verification via email
        `,
        '',
        {
          timeOut: 50000,
          enableHtml: true,
          positionClass: 'toast-top-right1',
        }
      );
      this.apolloService
        .query(profile_info, {})
        .then((res) => {
          this.loading = false;
          const result = res.profile_info;
          if (!result.error) {
            this.revision = result.data.revision;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    }
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm2.controls;
  }

  getProfileInfo() {
    this.apolloService.query(profile_info, {}).then((res) => {
      if (!res.profile_info.error) {
        const result = res.profile_info.data;
        localStorage.setItem('email', result.email);
        localStorage.setItem('firstName', result.firstName);
        localStorage.setItem('lastName', result.lastName);
        localStorage.setItem('memberyn', result.memberyn.toString());
        localStorage.setItem('id', result.id.toString());
        localStorage.setItem('avatar', result.avatar);
        localStorage.setItem('welcomeyn', result.welcomeyn.toString());
        this.router.navigate(['apps/projects']);
      } else {
        // this.toastr.info(
        //   'Registration successful. Please wait for verification.',
        //   ''
        // );
        this.router.navigate(['auth/login']);
      }
      this.loading = false;
    });
  }

  updatePhone(code) {
    this.apolloService
      .mutate(profile_activate, {
        revision: this.revision,
        mobile: this.formValues['phone'].value,
        twofa: this.formValues['f2_auth'].value,
        verificationCode: code,
      })
      .then((res) => {
        this.loading = false;
        if (!res.profile_activate.error) {
          this.getProfileInfo();
        } else {
          this.error = res.profile_activate.message;
        }
      })
      .catch((err) => {
        this.loading = false;
      });
  }

  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.modalService.dismissAll();

    this.loading = true;

    if (this.companyFlag) {
      this.httpService
        .post('signup', {
          email: localStorage.getItem('email'),
          password: localStorage.getItem('password'),
          firstname: this.formValues['firstname'].value,
          lastname: this.formValues['lastname'].value,
          idcompany: parseInt(localStorage.getItem('id')),
          companyname: this.formValues['companyName'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            localStorage.removeItem('password');
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            this.updatePhone(code);
          } else {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    } else {
      this.updatePhone(code);
    }
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  /**
   * On form submit
   */
  paracont: string = 'Resend';
  onSubmit(): void {
    this.phoneError = '';
    this.error = '';
    this.formSubmitted = true;
    if (this.signUpForm2.valid) {
      if (
        this.formValues['f2_auth'].value &&
        this.formValues['phone'].value.length == 0
      ) {
        this.phoneError = 'error';
        return;
      }

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
