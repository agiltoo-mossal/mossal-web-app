import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFinancialInstitutionsComponent } from './form-financial_institutions.component';

describe('FormFinancialInstitutionsComponent', () => {
  let component: FormFinancialInstitutionsComponent;
  let fixture: ComponentFixture<FormFinancialInstitutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFinancialInstitutionsComponent]
    });
    fixture = TestBed.createComponent(FormFinancialInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
