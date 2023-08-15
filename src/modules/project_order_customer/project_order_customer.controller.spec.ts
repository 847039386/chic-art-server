import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderCustomerController } from './project_order_customer.controller';
import { ProjectOrderCustomerService } from './project_order_customer.service';

describe('ProjectOrderCustomerController', () => {
  let controller: ProjectOrderCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderCustomerController],
      providers: [ProjectOrderCustomerService],
    }).compile();

    controller = module.get<ProjectOrderCustomerController>(ProjectOrderCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
