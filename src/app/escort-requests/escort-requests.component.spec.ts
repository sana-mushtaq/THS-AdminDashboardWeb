import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscortRequestsComponent } from './escort-requests.component';

describe('EscortRequestsComponent', () => {
  let component: EscortRequestsComponent;
  let fixture: ComponentFixture<EscortRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscortRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscortRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
