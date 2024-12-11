import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingEventComponent } from './organization-setting-event.component';

describe('OrganizationSettingEventComponent', () => {
  let component: OrganizationSettingEventComponent;
  let fixture: ComponentFixture<OrganizationSettingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettingEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationSettingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
