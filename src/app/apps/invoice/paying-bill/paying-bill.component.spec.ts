import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayingBillComponent } from './paying-bill.component';

describe('PayingBillComponent', () => {
  let component: PayingBillComponent;
  let fixture: ComponentFixture<PayingBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayingBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayingBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
