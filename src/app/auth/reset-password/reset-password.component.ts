import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  setNewPassswordForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password:[''],
    newpassword:['']
  });
  formSubmitted: boolean = false;
  successMessage?: string;

  showPassword:boolean = false;
  showConfirmPassword : boolean =false;


  constructor (
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
  }

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
      
    }
  }
}
