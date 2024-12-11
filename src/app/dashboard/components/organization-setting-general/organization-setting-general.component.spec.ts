import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingGeneralComponent } from './organization-setting-general.component';

describe('OrganizationSettingGeneralComponent', () => {
  let component: OrganizationSettingGeneralComponent;
  let fixture: ComponentFixture<OrganizationSettingGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettingGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSettingGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
