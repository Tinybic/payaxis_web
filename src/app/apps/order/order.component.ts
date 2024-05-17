import { Component } from '@angular/core';
import { Base } from 'src/app/core/base';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends Base {
  tabs1 = 1;
  canCreate = false;

  constructor(
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.canCreate = super.setRole('Create Order');
    this.tabs1 = parseInt(window.localStorage.getItem('OrdersTabActiveIndex'));
  }
  
  setTabActiveIndex(index: string){
    window.localStorage.setItem('OrdersTabActiveIndex', index);
  }
  
  openDetail(id) {
    this.router.navigate(['apps/order/detail/' + id]);
  }
}
