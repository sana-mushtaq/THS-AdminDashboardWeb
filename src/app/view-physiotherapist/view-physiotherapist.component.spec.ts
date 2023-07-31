import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPhysiotherapistComponent } from './view-physiotherapist.component';

describe('ViewPhysiotherapistComponent', () => {
  let component: ViewPhysiotherapistComponent;
  let fixture: ComponentFixture<ViewPhysiotherapistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPhysiotherapistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPhysiotherapistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
