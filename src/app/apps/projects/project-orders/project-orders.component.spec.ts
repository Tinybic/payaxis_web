import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOrdersComponent } from './project-orders.component';

describe('ProjectOrdersComponent', () => {
  let component: ProjectOrdersComponent;
  let fixture: ComponentFixture<ProjectOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
