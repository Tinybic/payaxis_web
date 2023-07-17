import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// service
import { HttpService } from 'src/app/core/service/http.service';


@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  error: string = '';
  returnUrl: string = '/';
  loading: boolean = false;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() { return this.loginForm.controls; }

  inputShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /**
  * On submit form
  */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.httpService
        .post('login', {
          email: this.formValues['email'].value,
          password: this.formValues['password'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.formValues['email'].setValue('');
          this.formValues['password'].setValue('');
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
  }


}
