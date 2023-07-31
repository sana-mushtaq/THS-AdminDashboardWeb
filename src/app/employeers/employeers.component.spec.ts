import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeersComponent } from './employeers.component';

describe('EmployeersComponent', () => {
  let component: EmployeersComponent;
  let fixture: ComponentFixture<EmployeersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
