import { TestBed } from '@angular/core/testing';

import { Artists } from './artists';

describe('Artists', () => {
  let service: Artists;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Artists);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
