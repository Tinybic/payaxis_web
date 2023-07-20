import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// service
import { HttpService } from 'src/app/core/service/http.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;
  loginForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  error: string = '';
  returnUrl: string = '/';
  loading: boolean = false;
  user: SocialUser;
  loggedIn: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private fb: UntypedFormBuilder,
    private authService: SocialAuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log(this.user);
    });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.loginForm.controls;
  }

  inputShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * On submit form
   */
  paracont = 'Resend';
  takeFourNumbers: any;
  onSubmit(): void {
    this.error = '';
    this.modalService.dismissAll();
    this.formSubmitted = true;
    if (this.loginForm.valid && this.paracont == 'Resend') {
      this.loading = true;
      this.httpService
        .post('login', {
          email: this.formValues['email'].value,
          password: this.formValues['password'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            localStorage.setItem('refreshtoken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            if (res.code == 113) {
              this.router.navigate(['auth/info']);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          } else if (res.code == 112) {
            this.openmodal();
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

  openmodal() {
    if (this.paracont == 'Resend') {
      this.paracont = 'Resend code in 00:59';

      this.openVerticallyCentered(this.centeredModal);
      let that = this;
      const numbers = interval(1000);
      this.takeFourNumbers = numbers.pipe(take(58));
      this.takeFourNumbers.subscribe({
        next(x): any {
          if (58 - x >= 10) that.paracont = 'Resend code in 00:' + (58 - x);
          else that.paracont = 'Resend code in 00:0' + (58 - x);
        },
        error(err): any {},
        complete(): any {
          that.paracont = 'Resend';
        },
      });
    }
  }

  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.modalService.dismissAll();
    this.httpService
      .post('loginsms', {
        email: this.formValues['email'].value,
        code: code,
      })
      .then((res) => {
        this.loading = false;
        if (!res.error) {
          localStorage.setItem('refreshtoken', res.data.refreshtoken);
          localStorage.setItem('token', res.data.token);
          this.router.navigate(['icons/feather']);
        } else {
          this.error = res.message;
        }
      })
      .catch((error) => {
        this.loading = false;
        this.error = error;
      });
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }
}
