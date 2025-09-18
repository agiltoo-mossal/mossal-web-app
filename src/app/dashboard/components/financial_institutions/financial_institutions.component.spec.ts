import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInstitutionsComponent } from './financial_institutions.component';

describe('FinancialInstitutionsComponent', () => {
  let component: FinancialInstitutionsComponent;
  let fixture: ComponentFixture<FinancialInstitutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialInstitutionsComponent]
    });
    fixture = TestBed.createComponent(FinancialInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
