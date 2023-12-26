import { TestBed } from '@angular/core/testing';

import { MedicaltagService } from './medicaltag.service';

describe('MedicaltagService', () => {
  let service: MedicaltagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicaltagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
