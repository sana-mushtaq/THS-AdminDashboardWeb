import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNursepackageComponent } from './edit-nursepackage.component';

describe('EditNursepackageComponent', () => {
  let component: EditNursepackageComponent;
  let fixture: ComponentFixture<EditNursepackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNursepackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNursepackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
