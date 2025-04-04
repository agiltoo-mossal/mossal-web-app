import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingSalaryRefundComponent } from './organization-setting-salary-refund.component';

describe('OrganizationSettingSalaryRefundComponent', () => {
  let component: OrganizationSettingSalaryRefundComponent;
  let fixture: ComponentFixture<OrganizationSettingSalaryRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettingSalaryRefundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSettingSalaryRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
