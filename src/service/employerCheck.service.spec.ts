/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmployerCheckService } from './employerCheck.service';

describe('Service: EmployerCheck', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployerCheckService]
    });
  });

  it('should ...', inject([EmployerCheckService], (service: EmployerCheckService) => {
    expect(service).toBeTruthy();
  }));
});
