import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restorerGuard } from './restorer-guard';

describe('restorerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restorerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
