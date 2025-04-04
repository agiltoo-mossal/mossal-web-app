import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCollaboratorComponent } from './detail-collaborator.component';

describe('DetailCollaboratorComponent', () => {
  let component: DetailCollaboratorComponent;
  let fixture: ComponentFixture<DetailCollaboratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCollaboratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
