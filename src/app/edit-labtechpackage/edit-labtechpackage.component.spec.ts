import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabtechpackageComponent } from './edit-labtechpackage.component';

describe('EditLabtechpackageComponent', () => {
  let component: EditLabtechpackageComponent;
  let fixture: ComponentFixture<EditLabtechpackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLabtechpackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabtechpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
