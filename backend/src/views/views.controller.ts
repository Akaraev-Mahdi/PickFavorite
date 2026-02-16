import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
    constructor(private viewsService: ViewsService){}

    @Post('/:id')
    viewTournaments(@Param('id') tournamentId: number, @Headers('authorization') user: string){
        return this.viewsService.viewTournaments(tournamentId, user)
    }

    @Get('get-view-tournaments')
    getViewTournaments(@Headers('authorization') user: string){
        return this.viewsService.getViewTournaments(user)
    }
}
