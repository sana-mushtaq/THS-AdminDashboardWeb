import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramNotScheduledComponent } from './program-not-scheduled.component';

describe('ProgramNotScheduledComponent', () => {
  let component: ProgramNotScheduledComponent;
  let fixture: ComponentFixture<ProgramNotScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramNotScheduledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramNotScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
