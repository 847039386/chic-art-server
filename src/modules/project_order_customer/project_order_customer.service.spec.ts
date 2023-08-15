import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderCustomerService } from './project_order_customer.service';

describe('ProjectOrderCustomerService', () => {
  let service: ProjectOrderCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderCustomerService],
    }).compile();

    service = module.get<ProjectOrderCustomerService>(ProjectOrderCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
