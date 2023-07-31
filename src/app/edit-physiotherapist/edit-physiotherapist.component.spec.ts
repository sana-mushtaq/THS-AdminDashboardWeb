import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhysiotherapistComponent } from './edit-physiotherapist.component';

describe('EditPhysiotherapistComponent', () => {
  let component: EditPhysiotherapistComponent;
  let fixture: ComponentFixture<EditPhysiotherapistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhysiotherapistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhysiotherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
