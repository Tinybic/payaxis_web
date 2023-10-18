import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderAddComponent } from './vendor-order-add.component';

describe('VendorOrderAddComponent', () => {
  let component: VendorOrderAddComponent;
  let fixture: ComponentFixture<VendorOrderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorOrderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
