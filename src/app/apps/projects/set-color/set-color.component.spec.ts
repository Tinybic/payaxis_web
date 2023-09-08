import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetColorComponent } from './set-color.component';

describe('SetColorComponent', () => {
  let component: SetColorComponent;
  let fixture: ComponentFixture<SetColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetColorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
