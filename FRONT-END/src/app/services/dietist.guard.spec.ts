import { TestBed, async, inject } from '@angular/core/testing';

import { DietistGuard } from './dietist.guard';

describe('DietistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DietistGuard]
    });
  });

  it('should ...', inject([DietistGuard], (guard: DietistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
