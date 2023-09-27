import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetagComponent } from './servicetag.component';

describe('ServicetagComponent', () => {
  let component: ServicetagComponent;
  let fixture: ComponentFixture<ServicetagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
