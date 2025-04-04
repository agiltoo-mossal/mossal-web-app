import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingEmergencyComponent } from './organization-setting-emergency.component';

describe('OrganizationSettingEmergencyComponent', () => {
  let component: OrganizationSettingEmergencyComponent;
  let fixture: ComponentFixture<OrganizationSettingEmergencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettingEmergencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSettingEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
