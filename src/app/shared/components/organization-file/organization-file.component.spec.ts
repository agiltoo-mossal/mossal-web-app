import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFileComponent } from './organization-file.component';

describe('OrganizationFileComponent', () => {
  let component: OrganizationFileComponent;
  let fixture: ComponentFixture<OrganizationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
