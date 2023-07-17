import { Injectable } from '@nestjs/common';
import { CreateUserGroupUserDto } from './dto/create-user_group_user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateUserGroupDto } from '../user_group/dto/create-user_group.dto';
import { familyTree, getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class UserGroupUserService {

  constructor(
    @InjectModel('UserGroupUser') private readonly userGroupUserSchema: Model<CreateUserGroupUserDto>,
    @InjectModel('UserGroup') private readonly userGroupSchema: Model<CreateUserGroupDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  async create(dto: CreateUserGroupUserDto) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      let user_group_all = treeFormat(await this.userGroupSchema.find({},{}).lean().session(session))
      let user_groups = await this.userGroupUserSchema.find({ user_id :new Types.ObjectId(dto.user_id)}).session(session)
      let family =  familyTree(user_group_all,dto.user_group_id)
      for (let index = 1; index < family.length; index++) {
      for (let jindex = 0; jindex < user_groups.length; jindex++) {
          if(family[index]._id == user_groups[jindex].user_group_id.toString()){
            throw new BaseException(ResultCode.USER_GROUP_USER_IS_EXIST_PARENT,{})
          }            
      }
      }
      let children = sonsTree(user_group_all,dto.user_group_id)
      let ids = getTreeIds(children)
      if(ids.length > 0){
        let o_ids = [];
        ids.forEach((item) => {
          o_ids.push(new Types.ObjectId(item))
        })
        await this.userGroupUserSchema.deleteMany({ user_id :new Types.ObjectId(dto.user_id),user_group_id: {$in: o_ids}}).session(session);
      }
      const user_group_user = new this.userGroupUserSchema({user_id :new Types.ObjectId(dto.user_id) ,user_group_id :new Types.ObjectId(dto.user_group_id)})
      result = await user_group_user.save({session :session})
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result

  }

  async remove(id: string) {
    return await this.userGroupUserSchema.findByIdAndRemove(id);
  }

  async getUserGroupByUserId(user_id :string){
    return await this.userGroupUserSchema.find({ user_id :new Types.ObjectId(user_id)})
  }

  async isExist(dto: CreateUserGroupUserDto){
    let result = await this.userGroupUserSchema.findOne({ user_id: new Types.ObjectId(dto.user_id) ,user_group_id:new Types.ObjectId(dto.user_group_id)})
    return result ? true : false
  }

}
