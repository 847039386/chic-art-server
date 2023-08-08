import { Test, TestingModule } from '@nestjs/testing';
import { ProjectOrderUserController } from './project_order_user.controller';
import { ProjectOrderUserService } from './project_order_user.service';

describe('ProjectOrderUserController', () => {
  let controller: ProjectOrderUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectOrderUserController],
      providers: [ProjectOrderUserService],
    }).compile();

    controller = module.get<ProjectOrderUserController>(ProjectOrderUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
