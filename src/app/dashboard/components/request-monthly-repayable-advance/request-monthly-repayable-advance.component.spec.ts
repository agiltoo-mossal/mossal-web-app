import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMonthlyRepayableAdvanceComponent } from './request-monthly-repayable-advance.component';

describe('RequestMonthlyRepayableAdvanceComponent', () => {
  let component: RequestMonthlyRepayableAdvanceComponent;
  let fixture: ComponentFixture<RequestMonthlyRepayableAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestMonthlyRepayableAdvanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestMonthlyRepayableAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
