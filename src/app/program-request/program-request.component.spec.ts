import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRequestComponent } from './program-request.component';

describe('ProgramRequestComponent', () => {
  let component: ProgramRequestComponent;
  let fixture: ComponentFixture<ProgramRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
