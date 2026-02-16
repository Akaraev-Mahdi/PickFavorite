import { Module } from '@nestjs/common';
import { TournamentController } from './tournaments.controller';
import { TournamentService } from './tournaments.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tournaments } from './schema/tournaments.schema';
import { Picture } from './schema/picture.schema';
import { FilesModule } from 'src/files/files.module';
import { PersonalPicturesResults } from './schema/personal-pictures-result.schema';
import { PassedTournaments } from './schema/passed.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Like } from 'src/like/schema/like.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forFeature([Tournaments, Picture, PersonalPicturesResults, PassedTournaments, Like]),
    FilesModule,
    AuthModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService]
})
export class TournamentModule {}
