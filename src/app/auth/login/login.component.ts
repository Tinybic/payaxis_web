import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { profile_info } from 'src/app/core/gql/user';
// service
import { HttpService } from 'src/app/core/service/http.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval, take } from 'rxjs';
import { ApolloService } from 'src/app/core/service/apollo.service';

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
  title: string = 'Log in';
  email: '';
  emailDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private apolloService: ApolloService
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    // get return url from route parameters or default to '/'
    const company = decodeURIComponent(
      this.activatedRoute.snapshot.queryParams['company']
    );
    if (company != 'undefined') this.title = 'Join the "' + company + '" team';
    this.email = this.activatedRoute.snapshot.queryParams['email'];

    if (this.email) {
      this.formValues['email'].setValue(this.email);
      this.emailDisabled = true;
    }
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
          if (!res.error || res.code == 103) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            this.getProfileInfo();
          } else if (res.code == 113) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('token', res.data.token);
            this.router.navigate(['auth/info']);
          } else if (res.code == 112) {
            this.loading = false;
            this.openmodal();
          } else {
            this.loading = false;
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

  getProfileInfo() {
    this.apolloService.query(profile_info, {}).then((res) => {
      if (!res.profile_info.error) {
        const result = res.profile_info.data;
        localStorage.setItem('email', this.formValues['email'].value);
        localStorage.setItem('firstName', result.firstName);
        localStorage.setItem('lastName', result.lastName);
        localStorage.setItem('memberyn', result.memberyn.toString());
        localStorage.setItem('id', result.id.toString());
        localStorage.setItem('avatar', result.avatar);
        localStorage.setItem('welcomeyn', result.welcomeyn.toString());
        this.router.navigate(['apps/projects']);
      }
      this.loading = false;
    });
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
        if (!res.error || res.code == 103) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('token', res.data.token);
          this.getProfileInfo();
        } else if (res.code == 113) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('token', res.data.token);
          this.router.navigate(['auth/info']);
        } else if (res.code == 112) {
          this.loading = false;
          this.openmodal();
        } else {
          this.loading = false;
          this.error = res.message;
        }
      })
      .catch((error) => {
        this.loading = false;
        this.error = error;
      });
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }
}
