import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredPatientlistComponent } from './unregistered-patientlist.component';

describe('UnregisteredPatientlistComponent', () => {
  let component: UnregisteredPatientlistComponent;
  let fixture: ComponentFixture<UnregisteredPatientlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredPatientlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredPatientlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
