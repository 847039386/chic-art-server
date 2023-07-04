import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './schema/account.schema';

@Injectable()
export class AccountService {

  constructor(@InjectModel('Account') private readonly accountSchema: Model<CreateAccountDto>) { }

  async create(createAccountDto: CreateAccountDto) {
    const account = new this.accountSchema(createAccountDto)
    return await account.save();
  }


  findAll() {
    return `This action returns all account`;
  }

  
  async findOne(query :any) : Promise<Account>{
    return await this.accountSchema.findOne(query).populate('user_id');
  }

  findByIdAndUpdate(id: number, updateAccountDto: UpdateAccountDto) {
    return this.accountSchema.findByIdAndUpdate(id,updateAccountDto);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
