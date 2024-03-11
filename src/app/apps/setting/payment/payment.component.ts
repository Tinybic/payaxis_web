import { Component, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  bankname_routing,
  companypayment_deactivate,
  companypayment_list,
  companypayment_new,
  companypayment_release,
  companypayment_setdefault,
  companypayment_update,
  companypayment_verify,
} from 'src/app/core/gql/payment';
import { matchValidator } from 'src/app/core/helpers/match.validator';
import { ApolloService } from 'src/app/core/service/apollo.service';

import {
  PlaidOnEventArgs,
  PlaidOnExitArgs,
  PlaidOnSuccessArgs,
} from 'ngx-plaid-link';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  public tokenFetched: boolean = false;
  // Fetch this from your backend.
  public linkToken = '';

  @ViewChild('addpayment') addpayment: any;
  @ViewChild('deletepayment') deletepayment: any;
  @ViewChild('cancelpayment') cancelpayment: any;
  @ViewChild('defaultpayment') defaultpayment: any;
  @ViewChild('verifypayment') verifypayment: any;

  paymentForm: UntypedFormGroup = this.fb.group({
    account: ['', [Validators.required]],
    reaccount: ['', [Validators.required, matchValidator('account')]],
    routing: ['', Validators.required],
    bankName: ['', Validators.required],
    holderName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    defaultPay: [null],
    payType: ['ACH'],
  });
  formSubmitted: boolean = false;
  loading = true;
  paymentList = [];
  idcompany = 0;
  selectIndex = 0;
  deletePaymentMessage = '';
  buttonText = 'Create';
  titleText = 'New Payment Method';
  id = 0;
  revision = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private apolloService: ApolloService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.getLinkToken(), 500);
    this.formValues['email'].setValue(localStorage.getItem('email'));
    this.idcompany = parseInt(localStorage.getItem('idcompany'));
    this.getPaymentList();
  }

  getPaymentList() {
    this.apolloService
      .query(companypayment_list, { idCompany: this.idcompany })
      .then((res) => {
        const result = res.companypayment_list;
        if (!result.error) {
          this.paymentList = result.data;
        }
        this.loading = false;
      });
  }

  selectIndexFn(index) {
    this.selectIndex = index;
  }

  get formValues() {
    return this.paymentForm.controls;
  }

  addref;
  openAddPaymentModal(index) {
    this.formSubmitted = false;
    if (index == -1) {
      this.clearFormValue();
      this.buttonText = 'Create';
      this.titleText = 'New Payment Method';
      this.formValues['email'].setValue(localStorage.getItem('email'));
    } else {
      this.setFormValue(index);
      this.titleText = 'Edit ACH Payment Method';
      this.buttonText = 'Save';
    }
    this.addref = this.modalService.open(this.addpayment, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
  }

  clearFormValue() {
    this.formValues['account'].setValue('');
    this.formValues['reaccount'].setValue('');
    this.formValues['routing'].setValue('');
    this.formValues['bankName'].setValue('');
    this.formValues['defaultPay'].setValue(false);
    this.formValues['holderName'].setValue('');
    this.formValues['email'].setValue('');
  }

  template = {
    account: '',
    routing: '',
    bankName: '',
    defaultPay: false,
    holderName: '',
    email: '',
    payType: '',
    verified: false,
    released: false,
  };
  setFormValue(index) {
    this.formValues['account'].setValue(this.paymentList[index].account);
    this.formValues['reaccount'].setValue(this.paymentList[index].account);
    this.formValues['routing'].setValue(this.paymentList[index].routing);
    this.formValues['bankName'].setValue(this.paymentList[index].bankName);
    this.formValues['defaultPay'].setValue(this.paymentList[index].defaultPay);
    this.formValues['holderName'].setValue(this.paymentList[index].holderName);
    this.formValues['email'].setValue(this.paymentList[index].email);
    this.id = this.paymentList[index].id;
    this.revision = this.paymentList[index].revision;

    this.template.account = this.paymentList[index].account;
    this.template.routing = this.paymentList[index].routing;
    this.template.bankName = this.paymentList[index].bankName;
    this.template.defaultPay = this.paymentList[index].defaultPay;
    this.template.holderName = this.paymentList[index].holderName;
    this.template.email = this.paymentList[index].email;
    this.template.payType = this.paymentList[index].payType;
    this.template.verified = this.paymentList[index].verified;
    this.template.released = this.paymentList[index].released;
  }

  defaultPaymentMessage = '';
  defaultPay = false;
  defaultRef;

  openDefaultModal(id, revision, defaultPay, account) {
    this.id = id;
    this.revision = revision;
    this.defaultPay = defaultPay;
    if (defaultPay)
      this.defaultPaymentMessage =
        account + ' payment will be set default payment.';
    else
      this.defaultPaymentMessage =
        account + ' payment will be unset default payment.';
    this.defaultRef = this.modalService.open(this.defaultpayment, {
      size: '530',
      centered: true,
    });
  }

  SetDefault() {
    this.apolloService
      .mutate(companypayment_setdefault, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: this.id,
        revision: this.revision,
        defaultPay: this.defaultPay,
      })
      .then((res) => {
        const result = res.companypayment_setdefault;
        let message = '';
        if (!result.error) {
          if (this.defaultPay) message = 'Make Default Payment Method';
          else message = 'Destroy Default Payment Method';
          this.getPaymentList();
          this.defaultRef.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  savePayment() {
    this.formSubmitted = true;
    if (this.paymentForm.valid) {
      if (this.buttonText == 'Create') {
        this.apolloService
          .mutate(companypayment_new, {
            idCompany: this.idcompany,
            account: this.formValues['account'].value,
            routing: this.formValues['routing'].value,
            payType: this.formValues['payType'].value,
            bankName: this.formValues['bankName'].value,
            holderName: this.formValues['holderName'].value,
            email: this.formValues['email'].value,
            defaultPay: this.formValues['defaultPay'].value,
          })
          .then((res) => {
            const result = res.companypayment_new;
            let message = '';
            if (!result.error) {
              message =
                'New ' +
                this.formValues['payType'].value +
                ' Payment Method was created';
              this.getPaymentList();
              this.addref.close();
            } else {
              message = result.message;
            }
            this.toastrService.info(message, '');
          });
      } else {
        this.apolloService
          .mutate(companypayment_update, {
            id: this.id,
            revision: this.revision,
            idCompany: this.idcompany,
            account: this.formValues['account'].value,
            routing: this.formValues['routing'].value,
            payType: this.formValues['payType'].value,
            bankName: this.formValues['bankName'].value,
            holderName: this.formValues['holderName'].value,
            email: this.formValues['email'].value,
            defaultPay: this.formValues['defaultPay'].value,
          })
          .then((res) => {
            const result = res.companypayment_update;
            let message = '';
            if (!result.error) {
              message =
                this.formValues['payType'].value +
                ' Payment Method was changed successfully';
              this.getPaymentList();
              this.addref.close();
            } else {
              message = result.message;
            }
            this.toastrService.info(message, '');
          });
      }
    }
  }

  deleteRef;
  openDeleteConfirmModal(id, revision, account) {
    this.id = id;
    this.revision = revision;
    this.deletePaymentMessage = account + ' payment will be deleted.';
    this.deleteRef = this.modalService.open(this.deletepayment, {
      size: '530',
      centered: true,
    });
  }

  deletePaymentItem() {
    this.apolloService
      .mutate(companypayment_deactivate, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: this.id,
        revision: this.revision,
      })
      .then((res) => {
        const result = res.companypayment_deactivate;
        let message = '';
        if (!result.error) {
          message =
            this.formValues['payType'].value +
            ' Payment Method was deleted successfully';
          this.getPaymentList();
          this.deleteRef.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  cancelRef;
  openCancelModal() {
    if (
      (this.buttonText == 'Create' &&
        this.formValues['account'].value.length == 0) ||
      (this.buttonText == 'Save' &&
        this.template.account == this.formValues['account'].value &&
        this.template.routing == this.formValues['routing'].value &&
        this.template.bankName == this.formValues['bankName'].value &&
        this.template.defaultPay == this.formValues['defaultPay'].value &&
        this.template.holderName == this.formValues['holderName'].value &&
        this.template.email == this.formValues['email'].value)
    ) {
      this.addref.close();
    } else {
      this.cancelRef = this.modalService.open(this.cancelpayment, {
        size: '530',
        centered: true,
      });
    }
  }

  cancelPayment() {
    this.cancelRef.close();
  }

  closeWithoutSave() {
    this.cancelRef.close();
    this.addref.close();
  }

  saveAndClose() {
    this.cancelRef.close();
    this.savePayment();
  }

  getBankName() {
    this.apolloService
      .query(bankname_routing, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        routing: this.formValues['routing'].value,
      })
      .then((res) => {
        const result = res.bankname_routing;
        if (!result.error) {
          this.formValues['bankName'].setValue(result.data);
        }
      });
  }

  enableButton() {}

  getLinkToken() {
    this.httpService
      .post('create_link_token', { iduser: localStorage.getItem('id') })
      .then((res) => {
        this.linkToken = res.data;
        this.tokenFetched = true;
      });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onSuccess(event: PlaidOnSuccessArgs) {
    console.log(event);
    for (let i = 0; i < event.metadata.accounts.length; i++) {
      this.httpService
        .post('exchange_processor_token', {
          public_token: event.token,
          account_id: event.metadata.accounts[i].id,
          idcompany: this.idcompany,
        })
        .then((res) => {
          if (!res.error) {
            this.apolloService
              .mutate(companypayment_new, {
                idCompany: this.idcompany,
                account: res.data[0].account,
                routing: res.data[0].routing,
                payType: 'PLAID',
                bankName: res.data[0].name,
                holderName: '',
                email: localStorage.getItem('email'),
                defaultPay: false,
              })
              .then((res) => {
                const result = res.companypayment_new;
                let message = '';
                if (!result.error) {
                  message = 'New Payment Method was created';
                  this.getPaymentList();
                  this.addref.close();
                } else {
                  message = result.message;
                }
                this.toastrService.info(message, '');
              });
          }
        });

      await this.sleep(2000);
    }
  }

  onExit(event: PlaidOnExitArgs) {
    console.log(event);
    this.toastrService.info('New Payment Method Exit', '');
  }

  amount_1 = '';
  amount_2 = '';
  verifyRef;
  openVerifyDeposits() {
    this.amount_1 = '';
    this.amount_1 = '';
    this.verifyRef = this.modalService.open(this.verifypayment, {
      size: '530',
      centered: true,
    });
  }

  verifyDeposits() {
    this.apolloService
      .mutate(companypayment_verify, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: this.id,
        revision: this.revision,
        amount_1: parseFloat(this.amount_1),
        amount_2: parseFloat(this.amount_2),
      })
      .then((res) => {
        const result = res.companypayment_verify;
        let message = '';
        if (!result.error) {
          message = 'Verify Micro-deposits success';
          this.getPaymentList();
          this.addref.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
        this.verifyRef.close();
      });
  }

  releasedDeposits() {
    this.apolloService
      .mutate(companypayment_release, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: this.id,
        revision: this.revision,
      })
      .then((res) => {
        const result = res.companypayment_release;
        let message = '';
        if (!result.error) {
          message = 'Release Micro-deposits success';
          this.getPaymentList();
          this.addref.close();
        } else {
          message = result.message;
        }

        this.toastrService.info(message, '');
      });
  }
}
