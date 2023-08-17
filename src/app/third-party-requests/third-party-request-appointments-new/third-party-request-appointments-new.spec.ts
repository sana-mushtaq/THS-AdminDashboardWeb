/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThirdPartyRequestsAppointmentsNewComponent } from './third-party-request-appointments-new';

describe('ThirdPartyRequestsAppointmentsNewComponent', () => {
  let component: ThirdPartyRequestsAppointmentsNewComponent;
  let fixture: ComponentFixture<ThirdPartyRequestsAppointmentsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdPartyRequestsAppointmentsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyRequestsAppointmentsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
