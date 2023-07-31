import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhysiotherapistComponent } from './add-physiotherapist.component';

describe('AddPhysiotherapistComponent', () => {
  let component: AddPhysiotherapistComponent;
  let fixture: ComponentFixture<AddPhysiotherapistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPhysiotherapistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhysiotherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
