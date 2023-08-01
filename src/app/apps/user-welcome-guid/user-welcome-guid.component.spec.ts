import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWelcomeGuidComponent } from './user-welcome-guid.component';

describe('UserWelcomeGuidComponent', () => {
  let component: UserWelcomeGuidComponent;
  let fixture: ComponentFixture<UserWelcomeGuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWelcomeGuidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWelcomeGuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
