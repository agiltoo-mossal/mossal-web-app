import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeProceduresComponent } from './administrative-procedures.component';

describe('AdministrativeProceduresComponent', () => {
  let component: AdministrativeProceduresComponent;
  let fixture: ComponentFixture<AdministrativeProceduresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrativeProceduresComponent]
    });
    fixture = TestBed.createComponent(AdministrativeProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
