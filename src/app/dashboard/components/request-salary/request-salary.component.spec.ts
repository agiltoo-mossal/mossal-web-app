import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSalaryComponent } from './request-salary.component';

describe('RequestSalaryComponent', () => {
  let component: RequestSalaryComponent;
  let fixture: ComponentFixture<RequestSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
