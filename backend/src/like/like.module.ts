import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Like } from './schema/like.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forFeature([Like])
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: []
})
export class LikeModule {}
