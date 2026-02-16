import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { Jwt_Service } from './jwt.service';
import { Token } from './schema/token.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forFeature([User, Token]),
    JwtModule.register({
      secret: process.env.POSTGRES_USER
    }),
    MailModule
  ],
  exports: [Jwt_Service],
  providers: [AuthService, Jwt_Service],
  controllers: [AuthController]
})
export class AuthModule {}
