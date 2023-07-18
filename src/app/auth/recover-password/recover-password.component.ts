import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  resetPassswordForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  formSubmitted: boolean = false;
  successMessage?: string;
  loading: boolean = false;
  error: string = '';

  constructor (
    private fb: UntypedFormBuilder,
    private httpService:HttpService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
  * convenience getter for easy access to form fields
  */
  get formValues() {
    return this.resetPassswordForm.controls;
  }

  /**
   * On form submit
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.resetPassswordForm.valid) {
      this.loading = true;
      this.httpService
        .post('forgot', {
          email: this.formValues['email'].value
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.router.navigate(['auth/confirm-mail']);
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
