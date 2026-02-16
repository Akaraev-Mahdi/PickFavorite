import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Tournaments } from './schema/tournaments.schema';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTournamentDto } from './dto/create.tournament.dto';
import { Picture } from './schema/picture.schema';
import { FilesService } from 'src/files/files.service';
import { jwtDecode } from "jwt-decode"
import { AddScoreDto } from './dto/add-score.dto';
import { PassedTournaments } from './schema/passed.schema';
import { PersonalPicturesResults } from './schema/personal-pictures-result.schema';
import { Like } from 'src/like/schema/like.schema';
import { Views } from 'src/views/schema/views.schema';
import { CreatePictureDto } from './dto/create.picture.dto';

@Injectable()
export class TournamentService {
    constructor(
        @InjectModel(Tournaments) private tournamentsRepository: typeof Tournaments,
        @InjectModel(Picture) private pictureRepository: typeof Picture,
        @InjectModel(PassedTournaments) private passedTournamentsRepository: typeof PassedTournaments,
        @InjectModel(PersonalPicturesResults) private personalPicturesResultsRepository: typeof PersonalPicturesResults,
        private fileService: FilesService,
    ){}

    async createTournament(dto: CreateTournamentDto, image: any, user: string){
        const decodeUser: any = jwtDecode(user)
        if(!image){
            throw new HttpException('Выберите изображение', HttpStatus.BAD_REQUEST)
        }
        const fileName = this.fileService.createFile(image)
        return await this.tournamentsRepository.create({
            title: dto.title, 
            description: dto.description, 
            image: fileName, 
            userId: decodeUser.id
        })
    }

    async createPicture(dto: CreatePictureDto, image: any, user: string){
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        if(dto.tournamentId === 'undefined'){
            throw new HttpException('Сначало создайте турнир', HttpStatus.BAD_REQUEST)
        }

        if(!image){
            throw new HttpException('Выберите изображение', HttpStatus.BAD_REQUEST)
        }

        const tournament = await this.tournamentsRepository.findOne({where: {id: dto.tournamentId}})

        if(tournament.userId !== decodeUser.id){
            throw new HttpException('Нет доступа', HttpStatus.BAD_REQUEST)
        }

        const fileName = this.fileService.createFile(image)
        return await this.pictureRepository.create({
            title: dto.title, 
            description: dto.description, 
            image: fileName, 
            userId: decodeUser.id,
            tournamentId: dto.tournamentId
        })
    }

    async deleteTournament(tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        const tournament = await this.tournamentsRepository.findOne({
            where: {id: tournamentId, userId: decodeUser.id}
        })

        const imgName = tournament.image
        await tournament.destroy()

        this.fileService.deleteFile(imgName)
    }

    async deletePicture(pictureId: number, tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        const tournament = await this.tournamentsRepository.findOne({where: {id: tournamentId}})

        if(tournament.userId !== decodeUser.id){
            throw new HttpException('Нет доступа', HttpStatus.BAD_REQUEST)
        }

        const picture = await this.pictureRepository.findOne({
            where: { id: pictureId, tournamentId: tournamentId }
        });
        const imgName = picture.image
        await picture.destroy()

        this.fileService.deleteFile(imgName)
    }

    async tournamentComplited(tournamentId: string){

        if(tournamentId === 'undefined'){
            throw new HttpException('Сначало создайте турнир', HttpStatus.BAD_REQUEST)
        }

        const tournament = await this.tournamentsRepository.findOne({
            where: {id: tournamentId},
            include: {model: Picture}
        })

        if(!tournament){
            throw new HttpException('Сначало создайте турнир', HttpStatus.BAD_REQUEST)
        }

        let length = tournament.picture.length

        const powerOfTwo = length && (length & (length - 1)) === 0

        if(!powerOfTwo){
            throw new HttpException('Количество изберателей должно быть чётным', HttpStatus.BAD_REQUEST)
        }

        console.log(typeof(length))

        if(length < 8){
            throw new HttpException('Количество изберателей должно быть не меньше 8', HttpStatus.BAD_REQUEST)
        }

        tournament.completed = true
        await tournament.save()

        return tournament
    }

    async chekTournamentCompleted(user: string) {
        const decodeUser: any = jwtDecode(user)

        if(!decodeUser){
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST)
        }

        await this.tournamentsRepository.destroy({where: {userId: decodeUser.id, completed: false}})
    }

    async addScore(dto: AddScoreDto, user: string){
        //Смотрим чётное ли количество изберателей мы получаем
        const powerOfTwo = dto.pictures.length && (dto.pictures.length & (dto.pictures.length - 1)) === 0

        if(!powerOfTwo){
            throw new HttpException('Некоректное число изберателей', HttpStatus.BAD_REQUEST)
        }

        const decodeUser: any = jwtDecode(user)

        //Проходил ли пользователь данный турнир ранее, если нет, составляем его личный топ, если да запрещаем проходить тест ещё раз
        const passedTournament = await this.passedTournamentsRepository.findOne({where: {userId: decodeUser.id, tournamentId: dto.tournamentId}})
        console.log(passedTournament)
        if(passedTournament !== null){
            throw new HttpException('Уже пройдено', HttpStatus.BAD_REQUEST)
        } else {
            for(let i = 0; i < dto.pictures.length; i++){
                await this.personalPicturesResultsRepository.create({
                    tournamentId: dto.tournamentId, 
                    userId: decodeUser.id, 
                    pictureId: dto.pictures[i].pictureId, 
                    score: dto.pictures[i].score
                })
            }
            await this.passedTournamentsRepository.create({userId: decodeUser.id, tournamentId: dto.tournamentId, passed: true})
        }

        //Поиск дубликатов
        const valueArr = dto.pictures.map(function(item){ return item.pictureId });
        const isDuplicate = valueArr.some(function(item, idx){ 
            return valueArr.indexOf(item) != idx 
        });

        if(isDuplicate){
            throw new HttpException('Обноружены дубликаты', HttpStatus.BAD_REQUEST)
        }

        //Проверяем корректное количество избератилей и назначенные им баллы
        let generalScoreSum = 0
        let nullCount = 0

        for(let i = 0; i < dto.pictures.length; i++){
            generalScoreSum += dto.pictures[i].score

            if(dto.pictures[i].score === 0){
                nullCount++
            }

        }

        if(generalScoreSum !== dto.pictures.length - 1 || nullCount !== dto.pictures.length / 2){
            throw new HttpException('Некоректно', HttpStatus.BAD_REQUEST)
        }

        //Прибавляем баллы изберателям
        for(let i = 0; i < dto.pictures.length; i++){
            const picture = await this.pictureRepository.findOne({where: {id: dto.pictures[i].pictureId}})
            picture.score += dto.pictures[i].score
            await picture.save()
        }
    }

    async getTournaments(user: string) {
        const decodeUser: any = jwtDecode(user)
        const tournaments = await this.tournamentsRepository.findAll({
            include: [
                {
                    model: Like
                },
                {
                    model: Views
                }
            ]
        })

        const tournamentsWithLikeInfo = tournaments.map(tournament => {
            const tournamentJson = JSON.parse(JSON.stringify(tournament))

            return {
                ...tournamentJson,
                likedByUser: tournamentJson.like.some(like => like.userId === decodeUser.id)
            }
        })

        return tournamentsWithLikeInfo
    }

    async getCreatedTournaments(user: string) {
        const decodeUser: any = jwtDecode(user)
        const tournaments = await this.tournamentsRepository.findAll({
            where: {userId: decodeUser.id},
            include: [
                {
                    model: Like
                },
                {
                    model: Views
                }
            ]
        })

        const tournamentsWithLikeInfo = tournaments.map(tournament => {
            const tournamentJson = JSON.parse(JSON.stringify(tournament))

            return {
                ...tournamentJson,
                likedByUser: tournamentJson.like.some(like => like.userId === decodeUser.id)
            }
        })

        return tournamentsWithLikeInfo
    }

    async getTournamentsPictures(tournamentId: number) {
        const pictures = await this.pictureRepository.findAll({where: {tournamentId: tournamentId}})
        const sortPictures = pictures.sort((a, b) => b.score - a.score)
        return sortPictures
    }

    async getTournamentsPersonalPictures(tournamentId: number, user: string) {
        const decodeUser: any = jwtDecode(user)
        const PersonalPictures = await this.personalPicturesResultsRepository.findAll({where: {tournamentId: tournamentId, userId: decodeUser.id}, include: [Picture]})
        const sortPersonalPictures = PersonalPictures.sort((a, b) => b.score - a.score)
        return sortPersonalPictures
    }
}
