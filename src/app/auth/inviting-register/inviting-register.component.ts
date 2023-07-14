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
import { ApolloService } from 'src/app/core/service/apollo.service';

// types
import { PasswordValidator } from 'src/app/core/helpers/password.validator';

@Component({
  selector: 'app-inviting-register',
  templateUrl: './inviting-register.component.html',
  styleUrls: ['./inviting-register.component.scss']
})
export class InvitingRegisterComponent implements OnInit {

  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;

  InvitingsignUpForm: UntypedFormGroup = this.fb.group({
    firstname:[''],
    lastname:['',[Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, PasswordValidator.strong]],
  });

  formSubmitted: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string = '';
  companyName: string = 'Company Name'

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
    private apolloService: ApolloService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
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

    this.ajaxRequest.fire();

    // if (this.signUpForm.valid) {
    //   this.loading = true;
    //   this.apolloService
    //     .mutate(SignupStep1, {
    //       email: this.formValues['email'].value,
    //       password: this.formValues['password'].value,
    //     })
    //     .then((res) => {
    //       const result = res.user_account_add;

    //       this.loading = false;
    //     })
    //     .catch((error) => {
    //       this.error = error;
    //     });
    // }
  }

}
