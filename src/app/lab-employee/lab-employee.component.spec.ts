import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabEmployeeComponent } from './lab-emplloyee.component';

describe('LabEmployeeComponent', () => {
  let component: LabEmployeeComponent;
  let fixture: ComponentFixture<LabEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
