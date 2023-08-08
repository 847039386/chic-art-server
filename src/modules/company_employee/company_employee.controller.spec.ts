import { Test, TestingModule } from '@nestjs/testing';
import { CompanyEmployeeController } from './company_employee.controller';
import { CompanyEmployeeService } from './company_employee.service';

describe('CompanyEmployeeController', () => {
  let controller: CompanyEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyEmployeeController],
      providers: [CompanyEmployeeService],
    }).compile();

    controller = module.get<CompanyEmployeeController>(CompanyEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
