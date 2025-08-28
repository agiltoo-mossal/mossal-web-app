import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSocietyComponent } from './create-society.component';

describe('CreateSocietyComponent', () => {
  let component: CreateSocietyComponent;
  let fixture: ComponentFixture<CreateSocietyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSocietyComponent]
    });
    fixture = TestBed.createComponent(CreateSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
