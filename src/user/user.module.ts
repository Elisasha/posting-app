import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, RoleGuard]
})
export class UserModule {}
