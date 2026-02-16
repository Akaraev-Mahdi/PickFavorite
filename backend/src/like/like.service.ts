import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './schema/like.schema';
import { jwtDecode } from 'jwt-decode';
import { Tournaments } from '../tournament/schema/tournaments.schema';
import { Views } from 'src/views/schema/views.schema';

@Injectable()
export class LikeService {
    constructor(@InjectModel(Like) private likeRepository: typeof Like){}

    async likeTournament(tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        if (!tournamentId) {
            return 'Все поля обязательны'
        }

        try {
            const existingLike = await this.likeRepository.findOne({
                where: { tournamentId, userId: decodeUser.id },
            })

            if(existingLike){
                return 'Лайк уже есть'
            }

            await this.likeRepository.create({ tournamentId, userId: decodeUser.id })
            return await this.likeRepository.count({where: {tournamentId: tournamentId}})
        } catch (error) {
            return 'что-то пошло не так'
        }
    }

    async unlikeTournament(tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        if (!tournamentId) {
            return 'Все поля обязательны'
        }

        try {
            const existingUnLike = await this.likeRepository.findOne({
                where: { tournamentId, userId: decodeUser.id },
            })

            if(!existingUnLike){
                return 'Лайка уже нет'
            }

            await this.likeRepository.destroy({ where: {tournamentId, userId: decodeUser.id} })
            return await this.likeRepository.count({where: {tournamentId: tournamentId}})
        } catch (error) {
            return 'что-то пошло не так'
        }
    }

    async getLikeTournament(user: string) {
        const decodeUser: any = jwtDecode(user)
        const tournaments = await this.likeRepository.findAll({
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
