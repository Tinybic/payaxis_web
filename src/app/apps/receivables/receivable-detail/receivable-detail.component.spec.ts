import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableDetailComponent } from './receivable-detail.component';

describe('ReceivableDetailComponent', () => {
  let component: ReceivableDetailComponent;
  let fixture: ComponentFixture<ReceivableDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivableDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
