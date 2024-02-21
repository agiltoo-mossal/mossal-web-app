import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineDataComponent } from './line-data.component';

describe('LineDataComponent', () => {
  let component: LineDataComponent;
  let fixture: ComponentFixture<LineDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineDataComponent]
    });
    fixture = TestBed.createComponent(LineDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
