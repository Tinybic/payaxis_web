import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdowndataComponent } from './dropdowndata.component';

describe('DropdowndataComponent', () => {
  let component: DropdowndataComponent;
  let fixture: ComponentFixture<DropdowndataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdowndataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdowndataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
