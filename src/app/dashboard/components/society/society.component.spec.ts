import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyComponent } from './society.component';

describe('SocietyComponent', () => {
  let component: SocietyComponent;
  let fixture: ComponentFixture<SocietyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietyComponent]
    });
    fixture = TestBed.createComponent(SocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
