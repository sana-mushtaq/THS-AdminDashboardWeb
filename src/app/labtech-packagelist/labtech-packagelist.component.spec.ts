import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtechPackagelistComponent } from './labtech-packagelist.component';

describe('LabtechPackagelistComponent', () => {
  let component: LabtechPackagelistComponent;
  let fixture: ComponentFixture<LabtechPackagelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtechPackagelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabtechPackagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
