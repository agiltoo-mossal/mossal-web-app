import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminMossallComponent } from './edit-admin-mossall.component';

describe('EditAdminMossallComponent', () => {
  let component: EditAdminMossallComponent;
  let fixture: ComponentFixture<EditAdminMossallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdminMossallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAdminMossallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
