import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaltagComponent } from './medicaltag.component';

describe('MedicaltagComponent', () => {
  let component: MedicaltagComponent;
  let fixture: ComponentFixture<MedicaltagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicaltagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicaltagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
