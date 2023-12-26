import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSellElementsComponent } from './go-sell-elements.component';

describe('GoSellElementsComponent', () => {
  let component: GoSellElementsComponent;
  let fixture: ComponentFixture<GoSellElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoSellElementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSellElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
