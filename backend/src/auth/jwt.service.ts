import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './schema/token.schema';
import { CreateTokenDto } from './dto/create.token.dto';

@Injectable()
export class Jwt_Service {
    constructor(
        @InjectModel(Token) private tokenRepository: typeof Token,
        private jwtService: JwtService
    ){}

    generateToken(payload: CreateTokenDto){
        const accessToken = this.jwtService.sign(payload, { expiresIn: "15d" })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: "30d" })
        
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async saveToken(userId: number, refreshToken: string){
        const tokenData = await this.tokenRepository.findOne({where: {userId: userId}})

        if(tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await this.tokenRepository.create({userId, refreshToken})

        return token
    }

    async removeToken(refreshToken: string){
        await this.tokenRepository.destroy({where: {refreshToken: refreshToken}})
    }

    async findToken(refreshToken: string){
        return await this.tokenRepository.findOne({where: {refreshToken: refreshToken}})
    }

    validateToken(token: string){
        try {
            const userData = this.jwtService.verify(token)
            return userData
        } catch (error) {
            return null
        }
    }
}
