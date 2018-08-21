import { TestBed, inject } from '@angular/core/testing';

import { ServiceTypeService } from './service-type.service';

describe('ServiceTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTypeService]
    });
  });

  it('should be created', inject([ServiceTypeService], (service: ServiceTypeService) => {
    expect(service).toBeTruthy();
  }));
});
