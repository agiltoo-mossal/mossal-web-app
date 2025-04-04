import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDemandeComponent } from './dialog-demande.component';

describe('DialogDemandeComponent', () => {
  let component: DialogDemandeComponent;
  let fixture: ComponentFixture<DialogDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
