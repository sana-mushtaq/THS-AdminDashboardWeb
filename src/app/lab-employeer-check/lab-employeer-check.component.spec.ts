import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabEmployeerCheckComponent } from './lab-employeer-check.component';

describe('LabEmployeerCheckComponent', () => {
  let component: LabEmployeerCheckComponent;
  let fixture: ComponentFixture<LabEmployeerCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabEmployeerCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabEmployeerCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
