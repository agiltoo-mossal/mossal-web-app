import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrolTopComponent } from './scrol-top.component';

describe('ScrolTopComponent', () => {
  let component: ScrolTopComponent;
  let fixture: ComponentFixture<ScrolTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrolTopComponent]
    });
    fixture = TestBed.createComponent(ScrolTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
