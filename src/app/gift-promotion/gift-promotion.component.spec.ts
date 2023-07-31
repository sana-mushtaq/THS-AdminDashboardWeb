import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftPromotionComponent } from './gift-promotion.component';

describe('GiftPromotionComponent', () => {
  let component: GiftPromotionComponent;
  let fixture: ComponentFixture<GiftPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftPromotionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
