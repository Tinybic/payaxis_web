import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-password-phone',
  templateUrl: './recover-password-phone.component.html',
  styleUrls: ['./recover-password-phone.component.scss']
})
export class RecoverPasswordPhoneComponent implements OnInit {

  resetPassswordForm: UntypedFormGroup = this.fb.group({
    phone: ['', [Validators.required]]
  });
  formSubmitted: boolean = false;
  successMessage?: string;

  constructor (
    private fb: UntypedFormBuilder,
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
      
    }
  }

}
