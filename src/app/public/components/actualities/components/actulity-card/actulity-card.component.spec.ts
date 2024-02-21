import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActulityCardComponent } from './actulity-card.component';

describe('ActulityCardComponent', () => {
  let component: ActulityCardComponent;
  let fixture: ComponentFixture<ActulityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActulityCardComponent]
    });
    fixture = TestBed.createComponent(ActulityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
