import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Views } from './schema/views.schema';
import { jwtDecode } from 'jwt-decode';
import { Tournaments } from '../tournament/schema/tournaments.schema';
import { Like } from 'src/like/schema/like.schema';

@Injectable()
export class ViewsService {
    constructor(@InjectModel(Views) private viewsRepository: typeof Views){}

    async viewTournaments(tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        if (!tournamentId) {
            return 'Все поля обязательны'
        }

        try {
            const existingView = await this.viewsRepository.findOne({
                where: { tournamentId, userId: decodeUser.id },
            })

            if(!existingView){
                await this.viewsRepository.create({ tournamentId, userId: decodeUser.id })
            }
        } catch (error) {
            return 'что-то пошло не так'
        }
    }

    async getViewTournaments(user: string) {
        const decodeUser: any = jwtDecode(user)
        const tournaments = await this.viewsRepository.findAll({
            where: {userId: decodeUser.id}, 
            include: [
                {model: Tournaments, include: [{model: Like}, {model: Views}]}
            ]
        })
        
        const tournamentsWithLikeInfo = tournaments.map(tournament => {
            const tournamentJson = JSON.parse(JSON.stringify(tournament.tournaments))

            return {
                ...tournamentJson,
                likedByUser: tournamentJson.like.some(like => like.userId === decodeUser.id)
            }
        })

        return tournamentsWithLikeInfo
    }
}
