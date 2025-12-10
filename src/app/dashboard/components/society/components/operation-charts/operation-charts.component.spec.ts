import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationChartsComponent } from './operation-charts.component';

describe('OperationChartsComponent', () => {
  let component: OperationChartsComponent;
  let fixture: ComponentFixture<OperationChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
