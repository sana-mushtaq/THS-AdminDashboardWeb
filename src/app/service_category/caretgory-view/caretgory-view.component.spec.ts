import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretgoryViewComponent } from './caretgory-view.component';

describe('CaretgoryViewComponent', () => {
  let component: CaretgoryViewComponent;
  let fixture: ComponentFixture<CaretgoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretgoryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaretgoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
