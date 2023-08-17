/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MirthService } from './mirth.service';

describe('Service: Mirth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MirthService]
    });
  });

  it('should ...', inject([MirthService], (service: MirthService) => {
    expect(service).toBeTruthy();
  }));
});
