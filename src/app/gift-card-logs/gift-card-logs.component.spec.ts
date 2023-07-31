import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardLogsComponent } from './gift-card-logs.component';

describe('GiftCardLogsComponent', () => {
  let component: GiftCardLogsComponent;
  let fixture: ComponentFixture<GiftCardLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftCardLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
