import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollobatorComponent } from './create-collobator.component';

describe('CreateCollobatorComponent', () => {
  let component: CreateCollobatorComponent;
  let fixture: ComponentFixture<CreateCollobatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCollobatorComponent]
    });
    fixture = TestBed.createComponent(CreateCollobatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
