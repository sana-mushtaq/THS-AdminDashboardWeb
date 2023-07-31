import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardHistoryComponent } from './gift-card-history.component';

describe('GiftCardHistoryComponent', () => {
  let component: GiftCardHistoryComponent;
  let fixture: ComponentFixture<GiftCardHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftCardHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
