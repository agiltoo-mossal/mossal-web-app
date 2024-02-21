import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathCardProgressComponent } from './path-card-progress.component';

describe('PathCardProgressComponent', () => {
  let component: PathCardProgressComponent;
  let fixture: ComponentFixture<PathCardProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathCardProgressComponent]
    });
    fixture = TestBed.createComponent(PathCardProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
