import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingAttachmentsComponent } from './mapping-attachments.component';

describe('MappingAttachmentsComponent', () => {
  let component: MappingAttachmentsComponent;
  let fixture: ComponentFixture<MappingAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
