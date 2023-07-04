import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './user_group.controller';
import { UserGroupService } from './user_group.service';

describe('UserGroupController', () => {
  let controller: UserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupController],
      providers: [UserGroupService],
    }).compile();

    controller = module.get<UserGroupController>(UserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
