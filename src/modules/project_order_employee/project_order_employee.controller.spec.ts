import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderEmployeeController } from './project_order_employee.controller';
import { ProjectOrderEmployeeService } from './project_order_employee.service';

describe('ProjectOrderEmployeeController', () => {
  let controller: ProjectOrderEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderEmployeeController],
      providers: [ProjectOrderEmployeeService],
    }).compile();

    controller = module.get<ProjectOrderEmployeeController>(ProjectOrderEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
