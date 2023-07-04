import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupUserController } from './user_group_user.controller';
import { UserGroupUserService } from './user_group_user.service';

describe('UserGroupUserController', () => {
  let controller: UserGroupUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupUserController],
      providers: [UserGroupUserService],
    }).compile();

    controller = module.get<UserGroupUserController>(UserGroupUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
