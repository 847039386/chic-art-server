import { Test, TestingModule } from '@nestjs/testing';
import { CompanyCameraService } from './company_camera.service';

describe('CompanyCameraService', () => {
  let service: CompanyCameraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyCameraService],
    }).compile();

    service = module.get<CompanyCameraService>(CompanyCameraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
