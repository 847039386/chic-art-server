import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderEmployeeService } from './project_order_employee.service';

describe('ProjectOrderEmployeeService', () => {
  let service: ProjectOrderEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectOrderEmployeeService],
    }).compile();

    service = module.get<ProjectOrderEmployeeService>(ProjectOrderEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
