import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceptionistComponent } from './add-receptionist.component';

describe('AddReceptionistComponent', () => {
  let component: AddReceptionistComponent;
  let fixture: ComponentFixture<AddReceptionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReceptionistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
