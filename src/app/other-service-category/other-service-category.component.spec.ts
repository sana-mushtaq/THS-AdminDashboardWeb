import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherServiceCategoryComponent } from './other-service-category.component';

describe('OtherServiceCategoryComponent', () => {
  let component: OtherServiceCategoryComponent;
  let fixture: ComponentFixture<OtherServiceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherServiceCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherServiceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
