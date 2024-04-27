import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundChartsComponent } from './refund-charts.component';

describe('RefundChartsComponent', () => {
  let component: RefundChartsComponent;
  let fixture: ComponentFixture<RefundChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefundChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
