import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordPhoneComponent } from './recover-password-phone.component';

describe('RecoverPasswordPhoneComponent', () => {
  let component: RecoverPasswordPhoneComponent;
  let fixture: ComponentFixture<RecoverPasswordPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverPasswordPhoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
