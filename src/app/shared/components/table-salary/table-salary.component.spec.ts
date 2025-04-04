import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSalaryComponent } from './table-salary.component';

describe('TableSalaryComponent', () => {
  let component: TableSalaryComponent;
  let fixture: ComponentFixture<TableSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
