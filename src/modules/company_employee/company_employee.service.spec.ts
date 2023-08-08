import { Test, TestingModule } from '@nestjs/testing';
import { CompanyEmployeeService } from './company_employee.service';

describe('CompanyEmployeeService', () => {
  let service: CompanyEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyEmployeeService],
    }).compile();

    service = module.get<CompanyEmployeeService>(CompanyEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
