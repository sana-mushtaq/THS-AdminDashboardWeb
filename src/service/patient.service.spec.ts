/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PatientsService } from './patient.service';

describe('Service: Patient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientsService]
    });
  });

  it('should ...', inject([PatientsService], (service: PatientsService) => {
    expect(service).toBeTruthy();
  }));
});
