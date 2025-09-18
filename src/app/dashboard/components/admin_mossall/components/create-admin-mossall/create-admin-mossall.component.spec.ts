import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminMossallComponent } from './create-admin-mossall.component';

describe('CreateAdminMossallComponent', () => {
  let component: CreateAdminMossallComponent;
  let fixture: ComponentFixture<CreateAdminMossallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdminMossallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAdminMossallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
