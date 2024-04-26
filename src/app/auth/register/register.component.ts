import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// service
import { HttpService } from 'src/app/core/service/http.service';

// types
import { PasswordValidator } from 'src/app/core/helpers/password.validator';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('ajaxRequest1') ajaxRequest1!: SwalComponent;
  @ViewChild('resendModal') resendModal: NgbModalRef;
  @ViewChild('companyListModal') companyListModal: NgbModalRef;
  @ViewChild('infoModal') infoModal: NgbModalRef;
  @ViewChild('loadModal') loadModal: NgbModalRef;

  signUpForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, PasswordValidator.strong]],
    acceptTerms: [false, Validators.requiredTrue],
  });

  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';
  countDown: number = 1000;
  resend: string = 'initial';
  intervalResend: any;
  loading2 = true;
  email: '';
  emailDisabled = false;

  firstName = '';
  lastName = '';

  companyList = [];

  public successAlertOption: SweetAlertOptions = {
    html: `<div style="overflow: hidden">
    <div class="swal2-alert-title">Verification confirmed</div>
    <div class="swal2-alert-content">Thank you!</div>
    <div class="swal2-icon swal2-success swal2-icon-show" style="display: flex;transform: scale(0.5);margin-top: -5px;">
       <div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div>
      <div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>
    </div>
    </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    width: 604,
    padding: 16,
    background: '#fff',
  };

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParams['token'];
    const code = this.activatedRoute.snapshot.queryParams['code'];
    this.email = this.activatedRoute.snapshot.queryParams['email'];

    if (token && code) {
      this.loading = true;
      this.httpService
        .post('activate', {
          token: encodeURIComponent(token),
          code: encodeURIComponent(code),
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.ajaxRequest1.fire();
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            this.toastr.info(
              `
            <div class="d-inline-block msssageIconDiv"><i class="fe-check-circle"></i></div>Verification is done. Welcome!
            `,
              '',
              {
                timeOut: 50000,
                enableHtml: true,
              }
            );
            setTimeout(() => {
              this.router.navigate(['auth/login']);
            }, 3000);
          } else {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    } else if (this.email) {
      this.formValues['email'].setValue(this.email);
      this.emailDisabled = true;
    }
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm.controls;
  }

  inputShowPassword() {
    this.showPassword = !this.showPassword;
  }

  companyListRef;

  getCompanyList() {
    this.httpService
      .post('emailcompanylist', {
        email: this.formValues['email'].value,
      })
      .then((res) => {
        this.loading = false;
        if (!res.error) {
          this.companyList = res.data;
          if (this.companyList.length > 0) {
            this.companyListRef = this.modalService.open(
              this.companyListModal,
              {
                size: '489',
                backdrop: 'static',
                centered: true,
              }
            );
          } else {
            this.askToJoin(0);
          }
        } else {
          this.error = res.message;
        }
      })
      .catch((error) => {
        this.loading = false;
        this.error = error;
      });
  }

  setResendInterval() {
    if (this.intervalResend) {
      clearInterval(this.intervalResend);
    }
    this.countDown = 60;
    this.resend = 'Resend code in 01:00';
    this.intervalResend = setInterval(() => {
      this.countDown--;
      if (this.countDown == -1) {
        this.resend = 'Resend';
        clearInterval(this.intervalResend);
      } else if (this.countDown < 10) {
        this.resend = 'Resend code in 00:' + '0' + this.countDown;
      } else {
        this.resend = 'Resend code in 00:' + this.countDown;
      }
    }, 1000);
  }

  sendVerifyCode() {
    if (
      (this.countDown === 1000 && this.resend === 'initial') ||
      (this.countDown === -1 && this.resend === 'Resend')
    ) {
      this.setResendInterval();
      this.httpService
        .post('send_email_activation', {
          email: this.formValues['email'].value,
        })
        .then((res) => {
          this.loading = false;
          if (res.error) {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    }
  }

  openResendModal() {
    this.countDown = 1000;
    this.resend = 'initial';
    this.modalService.open(this.resendModal, {
      backdrop: 'static',
      centered: true,
    });
    this.setResendInterval();
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    this.error = '';
    if (this.signUpForm.valid) {
      this.loading = true;
      this.getCompanyList();
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalResend);
  }

  infoModalRef;
  askToJoin(id) {
    if (this.companyListRef) this.companyListRef.close();
    this.localStorage.setItem('join', id);
    if (id == 0) {
      this.router.navigate(['auth/info']);
      this.localStorage.setItem('email', this.formValues['email'].value);
      this.localStorage.setItem('password', this.formValues['password'].value);
      this.modalService.dismissAll();
    } else {
      this.infoModalRef = this.modalService.open(this.infoModal, {
        size: '489',
        backdrop: 'static',
        centered: true,
      });
    }
  }

  signUpRef;
  signUp() {
    this.infoModalRef.close();
    this.signUpRef = this.modalService.open(this.loadModal, {
      backdrop: 'static',
      centered: true,
    });

    if (this.localStorage.getItem('join').length > 0) {
      this.httpService
        .post('signup', {
          email: this.formValues['email'].value,
          password: this.formValues['password'].value,
          firstname: this.firstName,
          lastname: this.lastName,
          idcompany: parseInt(this.localStorage.getItem('join')),
          companyname: ' ',
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            setTimeout(() => {
              this.signUpRef.close();
              this.router.navigate(['auth/info']);
            }, 2000);
          } else {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    } else {
      this.toastr.info('Company required!', '');
    }
  }
}
