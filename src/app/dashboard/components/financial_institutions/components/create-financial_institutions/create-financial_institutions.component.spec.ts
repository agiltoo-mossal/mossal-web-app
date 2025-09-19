import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFinancialInstitutionsComponent } from './create-financial_institutions.component';

describe('CreateFinancialInstitutionsComponent', () => {
  let component: CreateFinancialInstitutionsComponent;
  let fixture: ComponentFixture<CreateFinancialInstitutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFinancialInstitutionsComponent]
    });
    fixture = TestBed.createComponent(CreateFinancialInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
