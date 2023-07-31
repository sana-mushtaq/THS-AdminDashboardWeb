import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabComponent } from './add-lab.component';

describe('AddLabComponent', () => {
  let component: AddLabComponent;
  let fixture: ComponentFixture<AddLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
