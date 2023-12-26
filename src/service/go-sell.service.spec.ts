import { TestBed } from '@angular/core/testing';

import { GoSellService } from './go-sell.service';

describe('GoSellService', () => {
  let service: GoSellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoSellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
