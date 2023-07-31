import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LablistComponent } from './lablist.component';

describe('LabslistComponent', () => {
  let component: LablistComponent;
  let fixture: ComponentFixture<LablistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LablistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LablistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
