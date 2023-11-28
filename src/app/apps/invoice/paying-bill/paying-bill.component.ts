import { Component, Input, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal, NgbModalRef, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ApolloService } from "../../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";
import { formatDate, formatCurrency} from "@angular/common";

@Component({
  selector: 'app-paying-bill',
  templateUrl: './paying-bill.component.html',
  styleUrls: ['./paying-bill.component.scss']
})
export class PayingBillComponent {
  @ViewChild('dp') dp: NgbDatepicker;
  @Input() modalRef: NgbModalRef;
  
  billNumber = 0;
  combine: boolean = true;
  amount = '0.00';
  vendor = '';
  address = '';
  memo = '';
  step = 1;
  btnOK = 'Continue';
  btnCancel = 'Cancel';
  
  currentDate: NgbDate = this.calendar.getToday()
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 3);
  outsideDays = 'visible';
  dueDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', -3);
  blueDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', -6);
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private calendar: NgbCalendar
  ){}
  
  ngOnInit(): void{
    this.amount = '100.00';
    this.billNumber = 256511;
    this.vendor = 'Joe & Son Plumbing Services';
    this.address = '1234 Main Street, Chicago IL 54667, United States';
  }
  
  onDateSelection(date: NgbDate){
    if(!this.fromDate && !this.toDate){
      this.fromDate = date;
    } else if(this.fromDate && !this.toDate && date.after(this.fromDate)){
      this.toDate = date;
    } else{
      this.toDate = null;
      this.fromDate = date;
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
          return formatDate(this.fromDate.month + '-' +this.fromDate.day, 'MMM d', 'en') + ' - ' + this.toDate.day+','+this.fromDate.year;
        }else{
          return formatDate(this.fromDate.month + '-' +this.fromDate.day, 'MMM d', 'en') + ' - ' + formatDate(this.toDate.month + '-' +this.toDate.day, 'MMM d', 'en')+', '+this.fromDate.year;
        }
      }else {
        return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' +this.fromDate.day, 'MMM d, y', 'en') + ' - ' + formatDate(this.toDate.year + '-' + this.toDate.month + '-' +this.toDate.day, 'MMM d, y', 'en');
      }
    }else{
      return formatDate(this.fromDate.year + '-' + this.fromDate.month + '-' +this.fromDate.day, 'MMM d, y', 'en');
    }
  }
  
  isHovered(date: NgbDate){
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }
  
  isInside(date: NgbDate){
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  
  isRange(date: NgbDate){
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      (this.hoveredDate && date.equals(this.hoveredDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  
  nextStep(step){
    if(step > 0 && step < 5){
      this.step = step;
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
}
