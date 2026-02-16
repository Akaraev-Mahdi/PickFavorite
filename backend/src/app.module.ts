import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { User } from './auth/schema/user.schema';
import { Token } from './auth/schema/token.schema';
import { TournamentModule } from './tournament/tournaments.module';
import { FilesModule } from './files/files.module';
import { Tournaments } from './tournament/schema/tournaments.schema';
import { Picture } from './tournament/schema/picture.schema';
import { Views } from './views/schema/views.schema';
import { Like } from './like/schema/like.schema';
import { PersonalPicturesResults } from './tournament/schema/personal-pictures-result.schema';
import { PassedTournaments } from './tournament/schema/passed.schema';
import { LikeModule } from './like/like.module';
import { ViewsModule } from './views/views.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static')
    }),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Token, Tournaments, Picture, Views, Like, PersonalPicturesResults, PassedTournaments],
      autoLoadModels: true
    }),
    AuthModule,
    MailModule,
    TournamentModule,
    FilesModule,
    LikeModule,
    ViewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
