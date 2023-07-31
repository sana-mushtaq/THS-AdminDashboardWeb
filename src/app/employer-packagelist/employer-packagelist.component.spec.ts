import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerPackagelistComponent } from './employer-packagelist.component';

describe('EmployerPackagelistComponent', () => {
  let component: EmployerPackagelistComponent;
  let fixture: ComponentFixture<EmployerPackagelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerPackagelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerPackagelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
