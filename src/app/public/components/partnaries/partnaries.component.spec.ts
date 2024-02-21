import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnariesComponent } from './partnaries.component';

describe('PartnariesComponent', () => {
  let component: PartnariesComponent;
  let fixture: ComponentFixture<PartnariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnariesComponent]
    });
    fixture = TestBed.createComponent(PartnariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
