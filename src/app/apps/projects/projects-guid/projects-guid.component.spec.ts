import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsGuidComponent } from './projects-guid.component';

describe('ProjectsGuidComponent', () => {
  let component: ProjectsGuidComponent;
  let fixture: ComponentFixture<ProjectsGuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsGuidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsGuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
