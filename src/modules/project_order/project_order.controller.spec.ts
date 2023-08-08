import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderController } from './project_order.controller';
import { ProjectOrderService } from './project_order.service';

describe('ProjectOrderController', () => {
  let controller: ProjectOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderController],
      providers: [ProjectOrderService],
    }).compile();

    controller = module.get<ProjectOrderController>(ProjectOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
