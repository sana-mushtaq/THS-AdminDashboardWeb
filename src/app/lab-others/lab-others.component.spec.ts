import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOthersComponent } from './lab-others.component';

describe('LabOthersComponent', () => {
  let component: LabOthersComponent;
  let fixture: ComponentFixture<LabOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOthersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
