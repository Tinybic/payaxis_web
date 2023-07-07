import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signUpForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

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
    }
  }
}
