import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdminMossallComponent } from './form-admin-mossall.component';

describe('FormAdminMossallComponent', () => {
  let component: FormAdminMossallComponent;
  let fixture: ComponentFixture<FormAdminMossallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAdminMossallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormAdminMossallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
