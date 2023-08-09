import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContactComponent } from './add-vendor-contact.component';

describe('AddVendorContactComponent', () => {
  let component: AddVendorContactComponent;
  let fixture: ComponentFixture<AddVendorContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVendorContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
