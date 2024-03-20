import { Component, Input, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal, NgbModalRef, NgbDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApolloService } from "../../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";
import { formatDate, formatCurrency } from "@angular/common";
import { projectpayment_pay } from "../../../core/gql/receivables";
import { vendorpayment_list } from "../../../core/gql/vendor-payment";

@Component({
  selector: 'app-paying-bill',
  templateUrl: './paying-bill.component.html',
  styleUrls: ['./paying-bill.component.scss']
})
export class PayingBillComponent {
  @Input() modalRef: NgbModalRef;
  @Input() payment: any;
  @Input() vendor: any;
  @ViewChild('dp') dp: NgbDatepicker;
  
  combine: boolean = true;
  amount = {
    value: '0.00',
    balance: '$0.00',
    redColor: false
  }
  memo = '';
  step = 1;
  btnOK = 'Continue';
  btnCancel = 'Cancel';
  
  currentDate: NgbDate = this.calendar.getToday()
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  outsideDays = 'visible';
  dueDate: NgbDate | null = null;
  blueDate: NgbDate | null = null;
  
  
  paymentList = [];
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar,
    private ngbDateFormater: NgbDateParserFormatter
  ){}
  
  ngOnInit(): void{
    this.amount.value = parseFloat(this.payment.amount).toFixed(2);
    this.dueDate = NgbDate.from(this.ngbDateFormater.parse(this.payment.dueDate));
    this.onDateSelection(this.currentDate);
    this.getPaymentList();
  }
  
  getRemainingOrderBalance(){
    if(Number.isFinite(parseFloat(this.amount.value))){
      const balance = this.payment.amount - parseFloat(this.amount.value);
      if(balance < 0){
        this.amount.redColor = true;
        this.amount.balance = '($' + (balance * -1).toFixed(2) + ')';
      } else{
        this.amount.redColor = false;
        this.amount.balance = balance.toFixed(2);
      }
    } else{
      this.amount.redColor = false;
      this.amount.balance = this.payment.amount;
    }
  }
  
  onDateSelection(date: NgbDate){
    this.blueDate = date;
    
    const weekDay = this.calendar.getWeekday(this.blueDate);
    switch(weekDay){
      case 6:
        this.fromDate = this.calendar.getNext(this.blueDate, 'd', 6);
        this.toDate = this.calendar.getNext(this.blueDate, 'd', 10);
        break;
      case 7:
        this.fromDate = this.calendar.getNext(this.blueDate, 'd', 5);
        this.toDate = this.calendar.getNext(this.blueDate, 'd', 9);
        break;
      default:
        this.fromDate = this.calendar.getNext(this.blueDate, 'd', 7);
        this.toDate = this.calendar.getNext(this.blueDate, 'd', 11);
        break;
    }
  }
  
  getDate(date){
    this.currentDate = {...date.next, ...{day: 1}};
  }
  
  navigateToMonth(status){
    if(status == 'prev'){
      this.dp.navigateTo(this.calendar.getPrev(this.currentDate, 'm'));
    } else{
      this.dp.navigateTo(this.calendar.getNext(this.currentDate, 'm'));
    }
  }
  
  isCurrentMonth(date: NgbDate, month){
    if(date.month == month){
      return 'current-month';
    } else{
      return 'outside'
    }
  }
  
  getDeliveryDateRange(){
    if(this.toDate){
      if(this.toDate.year == this.fromDate.year){
        if(this.toDate.month == this.fromDate.month){
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + this.toDate.day + ',' + this.fromDate.year;
        } else{
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' + this.toDate.day, 'MMM d', 'en') + ', ' + this.fromDate.year;
        }
      } else{
        return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en') + ' - ' + formatDate(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day, 'MMM d, y', 'en');
      }
    } else{
      return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en');
    }
  }
  
  isRange(date: NgbDate){
    return this.fromDate && this.toDate && ((date.equals(this.fromDate) || date.equals(this.toDate))
      || (date.after(this.fromDate) && date.before(this.toDate)))
  }
  
  
  getPaymentList(){
    this.apolloService.query(vendorpayment_list, {
      idCompany: parseInt(this.payment.idCompany),
      idVendor: parseInt(this.payment.idVendor)
    }).then((res) => {
      const result = res.vendorpayment_list;
      if(!result.error){
        const list = result.data;
        if(list.length > 0){
          list.map((item) => {
            if(item.defaultPay){
              this.paymentList.push(item);
            }
          })
          if(this.paymentList.length == 0){
            this.paymentList.push(list[0]);
          }
        }
      }
    });
  }
  
  savePayingBill(){
    let params = {
      idCompany: parseInt(this.payment.idCompany),
      id: parseInt(this.payment.id),
      revision: parseInt(this.payment.revision),
      idVendor_payment: parseInt(this.payment.idVendor),
      paidDate: this.blueDate.year + '-' + this.blueDate.month + '-' + this.blueDate.day,
      amount: this.parseFloat(this.amount.value)
    }
    
    this.apolloService.mutate(projectpayment_pay, params).then((res) => {
      let result = res.projectpayment_pay;
      if(!result.error){
        this.step++;
        this.btnOK = 'Notify my vendor';
        this.btnCancel = 'Thanks, I’m done here';
      } else{
        this.toastrService.info(result.message, '');
      }
    })
    
  }
  
  nextStep(direction){
    if(this.step === 4){
      this.modalService.dismissAll();
      return;
    }
    if(direction == 'continue'){
      if(this.step !== 3){
        this.step++;
      } else{
        this.savePayingBill();
      }
    } else{
      if(this.step < 4){
        this.step--;
      }
    }
    if(this.step > 0 && this.step < 5){
      switch(this.step){
        case 1:
          this.btnOK = 'Continue';
          this.btnCancel = 'Cancel';
          break;
        case 2:
          this.btnOK = 'Continue';
          this.btnCancel = 'Back';
          break;
        case 3:
          this.btnOK = 'Confirm and schedule payment';
          this.btnCancel = 'Back';
          break;
        case 4:
          this.btnOK = 'Notify my vendor';
          this.btnCancel = 'Thanks, I’m done here';
          break;
        default:
          this.btnOK = 'Continue';
          this.btnCancel = 'Cancel';
          break;
      }
    }
  }
  
  protected readonly parseFloat = parseFloat;
}
