import { TestBed } from '@angular/core/testing';

import { ApiTMDBService } from './api-tmdb.service';

describe('ApiTMDBService', () => {
  let service: ApiTMDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTMDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
