import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSourceComponent } from './patient-source.component';

describe('PatientSourceComponent', () => {
  let component: PatientSourceComponent;
  let fixture: ComponentFixture<PatientSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
