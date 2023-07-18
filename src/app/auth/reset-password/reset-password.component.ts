import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PasswordValidator } from 'src/app/core/helpers/password.validator';
import { HttpService } from 'src/app/core/service/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  setNewPassswordForm: UntypedFormGroup = this.fb.group({
    number: ['', [Validators.required]],
    password: ['', [Validators.required, PasswordValidator.strong]],
    newpassword: ['', [Validators.required, PasswordValidator.strong]],
  });
  formSubmitted: boolean = false;
  successMessage?: string;
  loading: boolean = false;
  error: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.setNewPassswordForm.controls;
  }

  inputShowPassword() {
    this.showPassword = !this.showPassword;
  }

  inputShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.formSubmitted = true;
   
    if (this.setNewPassswordForm.valid) {
      if (this.formValues['newpassword'].value == this.formValues['password'].value) {
        const token = this.activatedRoute.snapshot.queryParams['token'];
        const code = this.activatedRoute.snapshot.queryParams['code'];

        if (token && code) {
          this.httpService
            .post('reset', {
              token: encodeURIComponent(token),
              code: encodeURIComponent(code),
              validation:this.formValues['number'].value,
              newpassword:this.formValues['password'].value
            })
            .then((res) => {
              this.loading = false;
              if (!res.error) {
                localStorage.setItem('refreshtoken', res.data.refreshtoken);
                localStorage.setItem('token', res.data.token);
                this.toastr.info('Your password has been successfully reset. Please log in.', 'Password reset.');
                this.router.navigate(['auth/login']);
              } else {
                this.error = res.message;
              }
            })
            .catch((error) => {
              this.loading = false;
              this.error = error;
            });
        }
      } else {
        this.error = "Passwords entered do not match.";
      }
    }
  }
}
