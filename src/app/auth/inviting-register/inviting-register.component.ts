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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inviting-register',
  templateUrl: './inviting-register.component.html',
  styleUrls: ['./inviting-register.component.scss'],
})
export class InvitingRegisterComponent implements OnInit {
  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;

  InvitingsignUpForm: UntypedFormGroup = this.fb.group({
    firstname: [''],
    lastname: ['', [Validators.required]],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, PasswordValidator.strong]],
    acceptTerms: [false, Validators.requiredTrue],
  });

  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';
  companyName: string = 'Company Name';
  token: string = '';
  code: string = '';

  public alertOption: SweetAlertOptions = {
    html: `<div>
    <div class="swal2-alert-title">A verification email have been sent to you.</div>
    <div class="swal2-alert-content">Please, check the email</div>
    <div class="swal2-alert-link">Resend<div>
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
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.code = this.activatedRoute.snapshot.queryParams['code'];

    if (this.token && this.code) {
      this.loading = true;
      this.httpService
        .post('companymember', {
          token: encodeURIComponent(this.token),
          code: encodeURIComponent(this.code),
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.formValues['email'].setValue(res.data[0].email);

            let message = '';
            message =
              '<img src="' +
              res.data[0].avatar +
              '"  class = "avatar-md rounded-circle me-1-1" /><b>' +
              res.data[0].firstName +
              ' ' +
              res.data[0].lastName +
              '</b> has invited you to the "' +
              res.data[0].companyname +
              '" team.';
            if (res.data[0].avatar.length < 10) {
              message =
                res.data[0].firstName +
                ' ' +
                res.data[0].lastName +
                '</b> has invited you to the "' +
                res.data[0].companyname +
                '" team.';
            }

            this.toastr.info(message, '', {
              timeOut: 20000,
              enableHtml: true,
            });
            this.companyName = res.data[0].companyname;
          } else {
            this.error = res.message;
            this.router.navigate(['auth/login']);
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
    return this.InvitingsignUpForm.controls;
  }

  inputShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;

    if (this.InvitingsignUpForm.valid) {
      this.loading = true;
      this.httpService
        .post('signupmember', {
          token: encodeURIComponent(this.token),
          code: encodeURIComponent(this.code),
          firstname: this.formValues['firstname'].value,
          lastname: this.formValues['lastname'].value,
          password: this.formValues['password'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.toastr.info(
              'Your account was successfully created. Please log in.',
              'Successful'
            );
            this.router.navigateByUrl(
              'auth/login?company=' + encodeURIComponent(this.companyName)
            );
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
