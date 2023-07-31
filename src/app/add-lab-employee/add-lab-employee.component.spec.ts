import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabEmployeeComponent } from './add-lab-employee.component';

describe('AddLabEmployeeComponent', () => {
  let component: AddLabEmployeeComponent;
  let fixture: ComponentFixture<AddLabEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLabEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
