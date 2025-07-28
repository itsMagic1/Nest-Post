import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleDb } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoleDb])
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
