import { Module } from '@nestjs/common';
import { Mail_Service } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL_FOR_NODEMAILER,
          pass: process.env.PASSWORD_FOR_NODEMAILER,
        },
      },
    })
  ],
  providers: [Mail_Service],
  exports: [Mail_Service]
})
export class MailModule {}
