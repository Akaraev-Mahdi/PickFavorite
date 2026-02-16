import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TournamentService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create.tournament.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddScoreDto } from './dto/add-score.dto';
import { authGuard } from '../gurds/authGuard';
import { CreatePictureDto } from './dto/create.picture.dto';

@Controller('tournament')
export class TournamentController {
    constructor(private tournamentService: TournamentService){}

    @UseGuards(authGuard)
    @Post('create-tournament')
    @UseInterceptors(FileInterceptor('image'))
    createTournament(@Body() dto: CreateTournamentDto, @Headers('authorization') user: string, @UploadedFile() image: any){
        return this.tournamentService.createTournament(dto, image, user)
    }

    @UseGuards(authGuard)
    @Post('create-picture')
    @UseInterceptors(FileInterceptor('image'))
    createPicture(@Body() dto: CreatePictureDto, @Headers('authorization') user: string, @UploadedFile() image: any){
        return this.tournamentService.createPicture(dto, image, user)
    }

    @Delete('delete-tournament')
    deleteTournament(@Body() {tournamentId}, @Headers('authorization') user: string){
        return this.tournamentService.deleteTournament(tournamentId, user)
    }

    @Delete('delete-picture')
    deletePicture(@Body() {pictureId, tournamentId}, @Headers('authorization') user: string){
        return this.tournamentService.deletePicture(pictureId, tournamentId, user)
    }

    @Put('tournament-complited/:id')
    tournamentComplited(@Param('id') tournamentId: string){
        return this.tournamentService.tournamentComplited(tournamentId)
    }

    @Post('chek-tournament-complited')
    chekTournamentComplited(@Headers('authorization') user: string){
        return this.tournamentService.chekTournamentCompleted(user)
    }
    
    @UseGuards(authGuard)
    @Post('add-score')
    addScore(@Body() dto: AddScoreDto, @Headers('authorization') user: string){
        return this.tournamentService.addScore(dto, user)
    }

    @Get()
    getTournaments(@Headers('authorization') user: string){
        return this.tournamentService.getTournaments(user)
    }

    @Get('get-created-tournaments')
    getCreatedTournaments(@Headers('authorization') user: string){
        return this.tournamentService.getCreatedTournaments(user)
    }

    @Get('/:id')
    getTournamentsPictures(@Param('id') tournamentId: number){
        return this.tournamentService.getTournamentsPictures(tournamentId)
    }

    @Get('get-personal-pictures/:id')
    getTournamentsPersonalPictures(@Param('id') tournamentId: number, @Headers('authorization') user: string){
        return this.tournamentService.getTournamentsPersonalPictures(tournamentId, user)
    }
}