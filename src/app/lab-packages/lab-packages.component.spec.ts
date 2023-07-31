import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPackagesComponent } from './lab-packages.component';

describe('LabPackagesComponent', () => {
  let component: LabPackagesComponent;
  let fixture: ComponentFixture<LabPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
