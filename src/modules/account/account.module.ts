import { Module ,forwardRef} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountSchema } from './schema/account.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  exports:[AccountService],
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema  }]),
    UserModule,
    forwardRef(() => AuthModule)
  ]
})
export class AccountModule {}
 