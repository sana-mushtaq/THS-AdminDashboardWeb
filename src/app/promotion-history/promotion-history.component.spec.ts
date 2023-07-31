import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionHistoryComponent } from './promotion-history.component';

describe('PromotionHistoryComponent', () => {
  let component: PromotionHistoryComponent;
  let fixture: ComponentFixture<PromotionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
