import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Mail_Service {
        constructor(private readonly mailService: MailerService){}

    async sendActivationMail(email: string, link: string) {
        await this.mailService.sendMail({
            from: process.env.EMAIL_FOR_NODEMAILER,
            to: email,
            subject: `i dont know what write here`,
            text: `Активируйте аккаунт по ссылке ${link}`,
        });
    }
}
