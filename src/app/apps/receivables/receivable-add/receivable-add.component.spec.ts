import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableAddComponent } from './receivable-add.component';

describe('ReceivableAddComponent', () => {
  let component: ReceivableAddComponent;
  let fixture: ComponentFixture<ReceivableAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
