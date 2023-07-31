import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultReadingComponent } from './result-reading.component';

describe('ResultReadingComponent', () => {
  let component: ResultReadingComponent;
  let fixture: ComponentFixture<ResultReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
