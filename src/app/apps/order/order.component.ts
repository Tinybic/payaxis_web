import { Component } from '@angular/core';
import { Base } from 'src/app/core/base';
import { ActivatedRoute, Router } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    const tab = this.activatedRoute.snapshot.queryParams['tab'];
    this.canCreate = super.setRole('Create Order');
    if (tab) {
      this.tabs1 = 2;
    }
  }
  openDetail(id) {
    this.router.navigate(['apps/order/detail/' + id]);
  }
}
