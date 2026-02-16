import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
    constructor(private likeService: LikeService){}

    @Post('like-tournament/:id')
    LikeDualChoice(@Param('id') tournamentId: number, @Headers('authorization') user: string){
        return this.likeService.likeTournament(tournamentId, user)
    }

    @Delete('unlike-tournament/:id')
    unLikeTournament(@Param('id') tournamentId: number, @Headers('authorization') user: string){
        return this.likeService.unlikeTournament(tournamentId, user)
    }

    @Get('get-like-tournament')
    getLikeTournament(@Headers('authorization') user: string){
        return this.likeService.getLikeTournament(user)
    }
}
