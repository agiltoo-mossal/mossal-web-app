import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminMossallComponent } from './user_admin_mossall.component';

describe('UserComponent', () => {
  let component: UserAdminMossallComponent;
  let fixture: ComponentFixture<UserAdminMossallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdminMossallComponent]
    });
    fixture = TestBed.createComponent(UserAdminMossallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
