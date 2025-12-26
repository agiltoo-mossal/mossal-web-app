import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationBalanceComponent } from './organization-balance.component';

describe('OrganizationBalanceComponent', () => {
  let component: OrganizationBalanceComponent;
  let fixture: ComponentFixture<OrganizationBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationBalanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
