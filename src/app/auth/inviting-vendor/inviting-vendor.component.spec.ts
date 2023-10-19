import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitingVendorComponent } from './inviting-vendor.component';

describe('InvitingVendorComponent', () => {
  let component: InvitingVendorComponent;
  let fixture: ComponentFixture<InvitingVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitingVendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitingVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
