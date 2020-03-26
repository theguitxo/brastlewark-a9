import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('Check if method for remove spaces works', () => {
    expect(UtilsService.removeSpaces('aaa bbb')).toBe('aaabbb');
  })
});
