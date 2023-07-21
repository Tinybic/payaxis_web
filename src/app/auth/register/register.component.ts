import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// service
import { HttpService } from 'src/app/core/service/http.service';

// types
import { PasswordValidator } from 'src/app/core/helpers/password.validator';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;
  @ViewChild('ajaxRequest1') ajaxRequest1!: SwalComponent;

  signUpForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, PasswordValidator.strong]],
    acceptTerms: [false, Validators.requiredTrue],
  });

  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';

  public alertOption: SweetAlertOptions = {
    html: `<div>
    <div class="swal2-alert-title">A verification email have been sent to you.</div>
    <div class="swal2-alert-content">Please, check the email</div>
    <div class="swal2-alert-link" id="resend">Resend<div>
    </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    width: 604,
    padding: 16,
    background: '#fff',
  };

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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParams['token'];
    const code = this.activatedRoute.snapshot.queryParams['code'];

    if (token && code) {
      this.loading = true;
      this.httpService
        .post(
          'activate',{
            token:encodeURIComponent(token),
            code: encodeURIComponent(code)
          })
        .then((res) => {
          this.loading = false;
          console.log(res);
          if (!res.error) {
            this.ajaxRequest1.fire();
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            setTimeout(() => {
              this.router.navigate(['auth/info']);
            }, 3000);
          } else {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
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


  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;

    if (this.signUpForm.valid) {
      this.loading = true;
      this.httpService
        .post('signup', {
          email: this.formValues['email'].value,
          password: this.formValues['password'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.ajaxRequest.fire();
            let that = this;
            setTimeout(() => {
              document.getElementById('resend').onclick = function () {
                that.httpService
                  .post('send_email_activation', {
                    email: that.formValues['email'].value,
                  })
                  .then((res) => {
                    that.loading = false;
                    if (!res.error) {
                      that.ajaxRequest.fire();
                    } else {
                      that.error = res.message;
                    }
                  })
                  .catch((error) => {
                    that.loading = false;
                    that.error = error;
                  });
              };
            }, 300);
          } else {
            this.error = res.message;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error;
        });
    }
  }
}
