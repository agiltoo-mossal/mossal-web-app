import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingSalaryComponent } from './organization-setting-salary.component';

describe('OrganizationSettingSalaryComponent', () => {
  let component: OrganizationSettingSalaryComponent;
  let fixture: ComponentFixture<OrganizationSettingSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettingSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSettingSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
