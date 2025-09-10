import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSocietyComponent } from './form-society.component';

describe('FormSocietyComponent', () => {
  let component: FormSocietyComponent;
  let fixture: ComponentFixture<FormSocietyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSocietyComponent]
    });
    fixture = TestBed.createComponent(FormSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
