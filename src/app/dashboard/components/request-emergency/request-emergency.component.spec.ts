import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEmergencyComponent } from './request-emergency.component';

describe('RequestEmergencyComponent', () => {
  let component: RequestEmergencyComponent;
  let fixture: ComponentFixture<RequestEmergencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestEmergencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
