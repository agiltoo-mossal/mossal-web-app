import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCollaboratorComponent } from './form-collaborator.component';

describe('FormCollaboratorComponent', () => {
  let component: FormCollaboratorComponent;
  let fixture: ComponentFixture<FormCollaboratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCollaboratorComponent]
    });
    fixture = TestBed.createComponent(FormCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
