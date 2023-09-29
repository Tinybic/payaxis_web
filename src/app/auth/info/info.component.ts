import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// service
import { ApolloService } from 'src/app/core/service/apollo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// types
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  profile_2fa,
  profile_activate,
  profile_info,
} from 'src/app/core/gql/user';
import { ToastrService } from 'ngx-toastr';
import { companyNew } from 'src/app/core/gql/company';
@Component({
  selector: 'app-auth-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @ViewChild('centeredModal') centeredModal: any;

  signUpForm2: UntypedFormGroup = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    phone: [''],
    f2_auth: [false],
  });

  formSubmitted: boolean = false;
  loading: boolean = false;
  error: string = '';
  phoneError = '';
  mobile: string = '';
  revision: number = 1;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.apolloService
      .query(profile_info, {})
      .then((res) => {
        this.loading = false;

        const result = res.profile_info;

        if (!result.error) {
          if (!result.data.active) {
            this.formValues['firstname'].setValue(result.data.firstName);
            this.formValues['lastname'].setValue(result.data.lastName);
            this.formValues['companyName'].setValue(result.data.companyName);
            this.formValues['phone'].setValue(result.data.mobile);
            this.formValues['f2_auth'].setValue(result.data.twofa);
            this.revision = result.data.revision;
          } else {
            localStorage.setItem('firstName', result.data.firstName);
            localStorage.setItem('lastName', result.data.lastName);
            localStorage.setItem('memberyn', result.data.memberyn.toString());
            localStorage.setItem('id', result.data.id.toString());
            localStorage.setItem('avatar', result.data.avatar);
            this.toastr.info(
              'This account has been activated. Please log in.',
              'Account information update.'
            );
            this.router.navigate(['auth/login']);
          }
        }
      })
      .catch((err) => {
        this.loading = false;
      });
  }

  /**
   * convenience getter for easy access to form fields
   */
  get formValues() {
    return this.signUpForm2.controls;
  }

  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.modalService.dismissAll();
    this.loading = true;
    this.apolloService
      .mutate(profile_activate, {
        revision: this.revision,
        firstName: this.formValues['firstname'].value,
        lastName: this.formValues['lastname'].value,
        companyName: this.formValues['companyName'].value,
        mobile: this.formValues['phone'].value,
        twofa: this.formValues['f2_auth'].value,
        verificationCode: code,
      })
      .then((res) => {
        this.loading = false;
        if (!res.profile_activate.error) {
          this.apolloService
            .mutate(companyNew, {
              id: 0,
              revision: 0,
              txtName: this.formValues['companyName'].value,
              taxId: '',
              idMasterCompany: 0,
              industry: '',
              paymentTerms: '',
              website: '',
              txtAddress: '',
              txtCity: '',
              txtState: '',
              txtZipcode: '',
              contactNumber: '',
              description: '',
              avatar: '',
              suiteNumber: '',
            })
            .then((res) => {
              let result;
              result = res.company_new;
              if (!result.error) {
                localStorage.setItem('idcompany', result.data.id);

                this.apolloService.query(profile_info, {}).then((res) => {
                  if (!res.profile_info.error) {
                    const result = res.profile_info.data;
                    localStorage.setItem('email', result.email);
                    localStorage.setItem('firstName', result.firstName);
                    localStorage.setItem('lastName', result.lastName);
                    localStorage.setItem(
                      'memberyn',
                      result.memberyn.toString()
                    );
                    localStorage.setItem('id', result.id.toString());
                    localStorage.setItem('avatar', result.avatar);
                    localStorage.setItem(
                      'welcomeyn',
                      result.welcomeyn.toString()
                    );

                    this.router.navigate(['apps/projects']);
                  }
                  this.loading = false;
                });
              }
            });
        } else {
          this.error = res.profile_activate.message;
        }
      })
      .catch((err) => {
        this.loading = false;
      });
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  /**
   * On form submit
   */
  paracont: string = 'Resend';
  onSubmit(): void {
    this.phoneError = '';
    this.error = '';
    this.formSubmitted = true;
    if (this.signUpForm2.valid) {
      if (
        this.formValues['f2_auth'].value &&
        this.formValues['phone'].value.length == 0
      ) {
        this.phoneError = 'error';
        return;
      }

      if (this.formValues['f2_auth'].value) {
        if (this.paracont == 'Resend') {
          this.modalService.dismissAll();
          this.paracont = 'Resend code in 00:59';
          this.apolloService
            .mutate(profile_2fa, { mobile: this.formValues['phone'].value })
            .then((res) => {
              if (res.profile_2fa) {
                this.mobile = this.formValues['phone'].value;
                this.openVerticallyCentered(this.centeredModal);
                let that = this;
                const numbers = interval(1000);
                const takeFourNumbers = numbers.pipe(take(58));
                takeFourNumbers.subscribe({
                  next(x): any {
                    if (58 - x >= 10)
                      that.paracont = 'Resend code in 00:' + (58 - x);
                    else that.paracont = 'Resend code in 00:0' + (58 - x);
                  },
                  error(err): any {},
                  complete(): any {
                    that.paracont = 'Resend';
                  },
                });
              }
            });
        }
      } else {
        this.onCodeCompleted('0000');
      }
    }
  }
}
