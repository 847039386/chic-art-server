import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderService } from './project_order.service';

describe('ProjectOrderService', () => {
  let service: ProjectOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderService],
    }).compile();

    service = module.get<ProjectOrderService>(ProjectOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
