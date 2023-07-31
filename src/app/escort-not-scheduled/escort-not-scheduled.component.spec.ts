import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscortNotScheduledComponent } from './escort-not-scheduled.component';

describe('EscortNotScheduledComponent', () => {
  let component: EscortNotScheduledComponent;
  let fixture: ComponentFixture<EscortNotScheduledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscortNotScheduledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscortNotScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
