import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

// service
import { AuthenticationService } from 'src/app/core/service/auth.service';

// types
import { User } from 'src/app/core/models/auth.models';


@Component({
  selector: 'app-auth-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {

  lockScreenForm!: UntypedFormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  constructor (
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.lockScreenForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
 * convenience getter for easy access to form fields
 */
  get formValues() {
    return this.lockScreenForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.lockScreenForm.valid) {
     
    }
  }

}
