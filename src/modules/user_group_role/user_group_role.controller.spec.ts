import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupRoleController } from './user_group_role.controller';
import { UserGroupRoleService } from './user_group_role.service';

describe('UserGroupRoleController', () => {
  let controller: UserGroupRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupRoleController],
      providers: [UserGroupRoleService],
    }).compile();

    controller = module.get<UserGroupRoleController>(UserGroupRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
