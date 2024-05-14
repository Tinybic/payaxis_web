import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal, NgbModalRef, NgbDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApolloService } from "../../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";
import { formatDate } from "@angular/common";
import { projectpayment_pay, projectpayment_paymultiple } from "../../../core/gql/receivables";
import { LocalStorageService } from "../../../core/service/local-storage.service";
import { vendor_list } from "../../../core/gql/vendor";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";

@Component({
  selector: 'app-paying-bill',
  templateUrl: './paying-bill.component.html',
  styleUrls: ['./paying-bill.component.scss']
})
export class PayingBillComponent {
  @Input() modalRef: NgbModalRef;
  @Input() payment: any;
  @Input() vendor?: any;
  @ViewChild('dp') dp: NgbDatepicker;
  
  combine: boolean = true;
  step = 1;
  btnOK = 'Continue';
  btnCancel = 'Cancel';
  
  currentDate: NgbDate = this.calendar.getToday()
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  outsideDays = 'visible';
  dueDate: NgbDate | null = null;
  blueDate: NgbDate | null = null;
  
  idCompany: number = 0;
  paymentList = [];
  vendorList: any[] = [];
  objectValues = Object.values;
  
  step3ActiveIndex: number = 0;
  
  progressTitles: [string, string, number][] = [['',
    '',
    0],
    ['How do you want to pay these Bills?',
      'Put amount and check Payment method',
      20],
    ['When would you like this payment sent?',
      'Choose a date for the payment to be sent.',
      60],
    ['How do you want to pay these Bills?',
      'Put amount and check Payment method',
      96]]
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar,
    private localStorage: LocalStorageService,
    private ngbDateFormater: NgbDateParserFormatter,
    private elementRef: ElementRef,
    public globalFuns: GlobalFunctionsService
  ){}
  
  ngOnInit(): void{
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    if(this.vendor === undefined){
      const groupedVendorIds = this.payment.reduce((acc, item) => {
        if(!acc[item.idVendor]){
          acc[item.idVendor] = [];
        }
        acc[item.idVendor].push(item);
        return acc;
      }, {} as { [key: number]: any[] })
      
      Object.keys(groupedVendorIds).map((item) => {
        let vendors = groupedVendorIds[item];
        let totalAmount = 0;
        let paymentOrderids = [];
        vendors.map((vendor) => {
          totalAmount += vendor.remainingAmount;
          paymentOrderids.push({
            idOrder1: vendor.id,
            number: vendor.orderNumber,
            dueDate: vendor.indvoicedueDate,
            amount: vendor.remainingAmount,
            status: vendor.status,
            currentAmount: {
              value: vendor.remainingAmount.toFixed(2),
              balance: 0.00,
              redColor: false
            }
          })
        })
        let vendor = {
          idProject: vendors[0].idProject,
          idVendor: vendors[0].idVendor,
          billNumber: '',
          costCode: '',
          paymentTerms: '',
          sentDate: '',
          dueDate: '',
          amount: totalAmount,
          txtNotes: '',
          idInvitedCompany: 0,
          vendorName: vendors[0].vendorName,
          vendorEmail: '',
          paymentOrderids: paymentOrderids
        }
        
        this.paymentList.push(vendor);
      })
      
      this.getVendorList();
    } else{
      this.paymentList = [{
        idCompany: this.idCompany,
        id: parseInt(this.payment.id),
        revision: parseInt(this.payment.revision),
        idVendor: parseInt(this.payment.idVendor),
        vendorName: this.payment.vendorName,
        billNumber: this.payment.billNumber,
        paidDate: '',
        amount: this.parseFloat(this.payment.amount),
        txtNotes: '',
        dueDate: this.payment.dueDate,
        paymentOrderids: [{
          number: this.payment.billNumber,
          dueDate: this.payment.dueDate,
          amount: this.payment.amount,
          currentAmount: {
            value: this.payment.amount.toFixed(2),
            balance: 0.00,
            redColor: false
          }
        }]
      }];
    }
    this.onDateSelection(this.currentDate);
  }
  
  amountKeyDown(e, item){
    const preValue = e.target.value;
    setTimeout(() => {
      if(e.target.value && e.target.value.length > 0){
        const currentValue = parseFloat(e.target.value.replace(/[$,]/g, ''));
        if(currentValue > item.amount){
          e.target.value = preValue;
          item.currentAmount.value = parseFloat(preValue.replace(/[$,]/g, ''));
        }
      }
      
      this.getRemainingOrderBalance(item);
    }, 0)
  }
  
  getRemainingOrderBalance(item){
    if(Number.isFinite(parseFloat(item.currentAmount.value))){
      const balance = item.amount - parseFloat(item.currentAmount.value);
      // if(this.vendor === undefined){
      if(balance > 0){
        item.currentAmount.redColor = true;
      } else{
        item.currentAmount.redColor = false;
      }
      item.currentAmount.balance = balance.toFixed(2);
      // } else{
      //   if(balance < 0){
      //     item.currentAmount.redColor = true;
      //     item.currentAmount.balance = '($' + (balance * -1).toFixed(2) + ')';
      //   } else{
      //     item.currentAmount.redColor = false;
      //     item.currentAmount.balance = balance.toFixed(2);
      //   }
      // }
    } else{
      item.currentAmount.redColor = false;
      item.currentAmount.balance = item.amount;
    }
  }
  
  getTotalAmount(item){
    let totalAmount = 0;
    item.paymentOrderids.map((subItem) => {
      totalAmount += parseFloat(subItem.currentAmount.value);
    })
    return totalAmount;
  }
  
  dateEqual(date){
    for(let i = 0; i < this.paymentList.length; i++){
      for(let j = 0; j < this.paymentList[i].paymentOrderids.length; j++){
        if(date.equals(NgbDate.from(this.ngbDateFormater.parse(this.paymentList[i].paymentOrderids[j].dueDate)))){
          return true;
        }
      }
    }
    return false;
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
  
  
  getDateRange(){
    if(this.toDate){
      const thisYear = new Date().getFullYear();
      if(this.toDate.year == thisYear && this.fromDate.year == thisYear){
        if(this.toDate.month == this.fromDate.month){
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + this.toDate.day;
        } else{
          return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' + this.toDate.day, 'MMM d', 'en');
        }
      } else{
        return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en') + ' - ' + formatDate(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day, 'MMM d, y', 'en');
      }
    } else{
      return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day, 'MMM d, y', 'en');
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
      const thisYear = new Date().getFullYear();
      if(this.toDate.year == thisYear && this.fromDate.year == thisYear){
        // if(this.toDate.month == this.fromDate.month){
        //   return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + this.toDate.day + ',' + this.fromDate.year;
        // } else{
        //   return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' + this.toDate.day, 'MMM d', 'en');
        // }
        return formatDate(this.fromDate.month + '-' + this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' + this.toDate.day, 'MMM d', 'en');
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
  
  getVendorList(){
    if(parseInt(this.localStorage.getItem('idcompany')) != 0){
      this.apolloService.query(vendor_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany'))
      }).then((res) => {
        const result = res.vendor_list;
        if(!result.error){
          this.vendorList = result.data;
          this.paymentList.map((item) => {
            for(let i = 0; i < this.vendorList.length; i++){
              if(this.vendorList[i].id === item.idVendor){
                item.idInvitedCompany = this.vendorList[i].idInvitedCompany;
                item.vendorEmail = this.vendorList[i].email;
                item.vendorAddress = this.vendorList[i].txtAddress;
                break;
              }
            }
          })
        }
      });
    }
  }
  
  selectVendor(idVendor, index){
    this.step3ActiveIndex = index;
    const vendorElement = this.elementRef.nativeElement.querySelector('#vendor_' + idVendor);
    vendorElement.scrollIntoView();
  }
  
  calcProgressPercentage(item){
    if(item.amount == 0){
      return 100;
    } else{
      return item.currentAmount.value / item.amount * 100;
    }
  }
  
  
  savePayingBill(){
    let params: any;
    let serviceName: any;
    
    if(this.vendor == undefined){
      serviceName = projectpayment_paymultiple;
      let paymentOrders: any[] = [];
      
      this.paymentList.map((item) => {
        let paymentOrderIds: any[] = [];
        item.paymentOrderids.map((order) => {
          let paymentOrderId = {
            idOrder1: order.idOrder1,
            amount: parseFloat(order.currentAmount.value)
          }
          paymentOrderIds.push(paymentOrderId);
        })
        let paymentOrder = {
          idProject: item.idProject,
          idVendor: item.idVendor,
          billNumber: '',
          costCode: '',
          sentDate: new Date(this.blueDate.year + '-' + this.blueDate.month + '-' + this.blueDate.day),
          dueDate: new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day),
          paymentTerms: '',
          amount: this.getTotalAmount(item),
          txtNotes: item.txtNotes,
          idInvitedCompany: item.idInvitedCompany,
          vendorName: item.vendorName,
          vendorEmail: item.vendorEmail,
          paymentOrderids: paymentOrderIds
        }
        paymentOrders.push(paymentOrder);
      })
      
      params = {
        idCompany: this.idCompany,
        paymentOrders: paymentOrders
      }
    } else{
      serviceName = projectpayment_pay;
      params = {
        idCompany: this.idCompany,
        id: parseInt(this.paymentList[0].id),
        revision: parseInt(this.paymentList[0].revision),
        idVendor: parseInt(this.paymentList[0].idVendor),
        paidDate: this.blueDate.year + '-' + this.blueDate.month + '-' + this.blueDate.day,
        amount: this.parseFloat(this.paymentList[0].paymentOrderids[0].currentAmount.value)
      }
    }
    
    this.apolloService.mutate(serviceName, params).then((res) => {
      let result: any = Object.values(res)[0];
      if(!result.error){
        this.step++;
        this.btnOK = 'Notify my vendor';
        this.btnCancel = 'Thanks, I\'m done here';
      } else{
        this.toastrService.info(result.message, '');
      }
    })
    
  }
  
  nextStep(direction){
    if(this.step === 4){
      if(this.vendor === undefined){
        this.modalRef.close();
      } else{
        this.modalService.dismissAll();
      }
      return;
    }
    if(direction == 'continue'){
      if(this.step !== 3){
        this.step++;
        if(this.step === 3 && this.vendor === undefined){
          let modal = document.getElementsByClassName('modal-640 modal-dialog modal-right');
          modal[0].className = 'modal-932 modal-dialog modal-right';
        }
      } else{
        this.savePayingBill();
      }
    } else{
      if(this.step == 1){
        this.modalRef.dismiss('cancel');
      } else if(this.step < 4){
        this.step--;
        if(this.step === 2 && this.vendor === undefined){
          let modal = document.getElementsByClassName('modal-932 modal-dialog modal-right');
          modal[0].className = 'modal-640 modal-dialog modal-right';
        }
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
          this.btnCancel = 'Thanks, I\'m done here';
          break;
        default:
          this.btnOK = 'Continue';
          this.btnCancel = 'Cancel';
          break;
      }
    }
  }
  
  protected readonly parseFloat = parseFloat;
  protected readonly JSON = JSON;
}
