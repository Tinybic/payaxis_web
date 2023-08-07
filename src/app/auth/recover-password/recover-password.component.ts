import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;
  @ViewChild('resendModal') resendModal: NgbModalRef;
  
  resetPasswordForm: UntypedFormGroup = this.fb.group({
    email: ['',
      [Validators.required,
        Validators.email]]
  });
  formSubmitted: boolean = false;
  successMessage?: string;
  loading: boolean = false;
  error: string = '';
  countDown: number = 1000;
  resend: string = 'initial';
  intervalResend: any;
  
  constructor(
    private fb: UntypedFormBuilder,
    private httpService: HttpService,
    private router: Router,
    private modalService: NgbModal
  ){}
  
  ngOnInit(): void{ }
  
  /**
   * convenience getter for easy access to form fields
   */
  get formValues(){
    return this.resetPasswordForm.controls;
  }
  
  /**
   * On form submit
   */
  onSubmit(): void{
    this.formSubmitted = true;
    this.modalService.dismissAll();
    if(this.resetPasswordForm.valid){
      this.modalService.open(this.centeredModal, {
        size: '337',
        centered: true
      });
    }
  }
  
  
  setResendInterval(){
    if((this.countDown === 1000 && this.resend === 'initial') || (this.countDown === -1 && this.resend === 'Resend')){
      if(this.intervalResend){
        clearInterval(this.intervalResend);
      }
      this.countDown = 60;
      this.resend = 'Resend code in 01:00';
      this.intervalResend = setInterval(() => {
        this.countDown--;
        if(this.countDown == -1){
          this.resend = 'Resend';
          clearInterval(this.intervalResend)
        } else if(this.countDown < 10){
          this.resend = 'Resend code in 00:' + '0' + this.countDown;
        } else{
          this.resend = 'Resend code in 00:' + this.countDown;
        }
      }, 1000)
    }
  }
  
  openResendModal(){
    this.countDown = 1000;
    this.resend = 'initial'
    this.modalService.open(this.resendModal, {
      backdrop: 'static',
      centered: true
    })
    this.setResendInterval();
  }
  
  
  resolved(captchaResponse){
    if(this.resetPasswordForm.valid){
      this.modalService.dismissAll();
      this.loading = true;
      this.httpService.post('forgot', {
        email: this.formValues['email'].value
      }).then((res) => {
        this.loading = false;
        if(!res.error){
          this.openResendModal();
        } else{
          this.error = res.message;
        }
      }).catch((error) => {
        this.loading = false;
        this.error = error;
      });
    }
  }
  
  errored(err){
    console.warn(`reCAPTCHA error encountered`);
  }
  
  ngOnDestroy(){
    clearInterval(this.intervalResend);
  }
}
