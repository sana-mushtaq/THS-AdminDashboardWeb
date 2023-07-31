import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscortServiceComponent } from './escort-service.component';

describe('EscortServiceComponent', () => {
  let component: EscortServiceComponent;
  let fixture: ComponentFixture<EscortServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscortServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscortServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
