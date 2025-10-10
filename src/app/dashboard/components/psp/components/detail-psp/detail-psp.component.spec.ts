import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPspComponent } from './detail-psp.component';

describe('DetailPspComponent', () => {
  let component: DetailPspComponent;
  let fixture: ComponentFixture<DetailPspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPspComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
