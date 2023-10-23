import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInviteComponent } from './vendor-invite.component';

describe('VendorInviteComponent', () => {
  let component: VendorInviteComponent;
  let fixture: ComponentFixture<VendorInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
