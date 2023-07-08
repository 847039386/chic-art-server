import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserInfoDto ,UpdateUserStateDto} from './dto/update-user.dto';
import { CURD } from 'src/shared/utils/curd.util';


@Injectable()
export class UserService {

  constructor(@InjectModel('User') private readonly userSchema: Model<CreateUserDto>) { }
  
  async create(createUserDto: CreateUserDto) {
    const user = new this.userSchema(createUserDto)
    return await user.save();
  }

  findAll(page :number ,limit :number) {
    const curd = new CURD<CreateUserDto>(this.userSchema)
    return curd.pagination(page,limit);
  }
 
  async updateInfo(dto: UpdateUserInfoDto) {
    return await this.userSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
    })
  }

  async updateState(dto: UpdateUserStateDto) {
    return await this.userSchema.findByIdAndUpdate(dto.id,{
      state :dto.state,
    })
  }
}
