import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFormModalComponentComponent } from './course-form-modal-component.component';

describe('CourseFormModalComponentComponent', () => {
  let component: CourseFormModalComponentComponent;
  let fixture: ComponentFixture<CourseFormModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFormModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
