import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBillsComponent } from './order-bills.component';

describe('OrderBillsComponent', () => {
  let component: OrderBillsComponent;
  let fixture: ComponentFixture<OrderBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
