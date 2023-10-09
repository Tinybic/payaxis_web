import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCostcodeComponent } from './add-costcode.component';

describe('AddCostcodeComponent', () => {
  let component: AddCostcodeComponent;
  let fixture: ComponentFixture<AddCostcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCostcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCostcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
