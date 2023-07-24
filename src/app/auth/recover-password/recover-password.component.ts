import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { HttpService } from 'src/app/core/service/http.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;
  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;
  
  resetPassswordForm: UntypedFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  formSubmitted: boolean = false;
  successMessage?: string;
  loading: boolean = false;
  error: string = '';

  public alertOption: SweetAlertOptions = {
    html: `<div>
    <div class="swal2-alert-title">A verification email have been sent to you.</div>
    <div class="swal2-alert-content">Please, check the email</div>
    <div class="Subtitle-3 font-14 mt-3">Didn't recieve the email? Check your spam filter or <span class="swal2-alert-link" id="resend">Resend</span><div>
    </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    width: 604,
    padding: 16,
    background: '#fff',
  };



  constructor(
    private fb: UntypedFormBuilder,
    private httpService: HttpService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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
      this.modalService.open(this.centeredModal, {
        size: '337',
        centered: true,
      });
    }
  }


  resolved(captchaResponse) {
    if (this.resetPassswordForm.valid) {
      this.modalService.dismissAll();
      this.loading = true;
      this.httpService
        .post('forgot', {
          email: this.formValues['email'].value,
        })
        .then((res) => {
          this.loading = false;
          if (!res.error) {
            this.ajaxRequest.fire();
            let that = this;
            setTimeout(() => {
              document.getElementById('resend').onclick = function () {
                that.onSubmit();
              };
            }, 300);
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

  errored(err) {
    console.warn(`reCAPTCHA error encountered`);
  }
}
