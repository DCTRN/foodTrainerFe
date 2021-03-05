import { TestBed } from '@angular/core/testing';
import { ComponentLoaderService } from './component-loader.service';

// TODO test
describe('ComponentLoaderService', () => {
  let service: ComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
