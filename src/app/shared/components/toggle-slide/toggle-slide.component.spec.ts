import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSlideComponent } from './toggle-slide.component';

describe('ToggleSlideComponent', () => {
  let component: ToggleSlideComponent;
  let fixture: ComponentFixture<ToggleSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSlideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
