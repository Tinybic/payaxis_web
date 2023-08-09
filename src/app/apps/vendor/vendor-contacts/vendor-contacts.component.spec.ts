import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorContactsComponent } from './vendor-contacts.component';

describe('VendorContactsComponent', () => {
  let component: VendorContactsComponent;
  let fixture: ComponentFixture<VendorContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
