import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEventComponent } from './request-event.component';

describe('RequestEventComponent', () => {
  let component: RequestEventComponent;
  let fixture: ComponentFixture<RequestEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
