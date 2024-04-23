import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignatureComponent } from './user-signature.component';

describe('UserSignatureComponent', () => {
  let component: UserSignatureComponent;
  let fixture: ComponentFixture<UserSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
