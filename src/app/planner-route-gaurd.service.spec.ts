import { TestBed } from '@angular/core/testing';

import { PlannerRouteGaurdService } from './planner-route-gaurd.service';

describe('PlannerRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlannerRouteGaurdService = TestBed.get(PlannerRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
