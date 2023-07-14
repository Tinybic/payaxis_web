import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitingRegisterComponent } from './inviting-register.component';

describe('InvitingRegisterComponent', () => {
  let component: InvitingRegisterComponent;
  let fixture: ComponentFixture<InvitingRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitingRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
