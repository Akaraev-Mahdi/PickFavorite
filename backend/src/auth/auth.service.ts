import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './schema/user.schema';
import { Mail_Service } from 'src/mail/mail.service';
import { RegistrationUserDto } from './dto/registration.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { Jwt_Service } from './jwt.service';
import { CreateTokenDto } from './dto/create.token.dto';
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private mailService: Mail_Service,
        private jwtService: Jwt_Service
    ){}

    async registration(dto: RegistrationUserDto){
        const candidate = await this.userRepository.findOne({where: {email: dto.email}})

        if (candidate) {
            throw new HttpException('Пользователь с такой почтой уже есть', HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(dto.password, 5)
        const generateLink = uuid.v4();
        const user = await this.userRepository.create({...dto, password: hashPassword, activationLink: generateLink})

        await this.mailService.sendActivationMail(user.email, `http://localhost:5000/auth/activate/${user.activationLink}`)

        const userDto = new CreateTokenDto(user)
        const tokens = this.jwtService.generateToken({...userDto})
        
        await this.jwtService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async activation(activationLink: string){
        const user = await this.userRepository.findOne({where: {activationLink: activationLink}})

        if(!user){
            throw new HttpException('Неккоректная ссылка активации', HttpStatus.BAD_REQUEST)
        }

        user.isActivated = true
        await user.save();
        return true
    }

    async login(dto: LoginUserDto){
        const user = await this.userRepository.findOne({where: {email: dto.email}})

        if(!user){
            throw new HttpException('Email введёнь неправильно', HttpStatus.BAD_REQUEST)
        }

        const passwordCompare = await bcrypt.compare(dto.password, user.password)

        if(!passwordCompare){
            throw new HttpException('Пароль введёнь неправильно', HttpStatus.BAD_REQUEST)
        }

        const userDto = new CreateTokenDto(user)
        const tokens = this.jwtService.generateToken({...userDto})
        await this.jwtService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken: string){
        await this.jwtService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string){
        if(!refreshToken){
            throw new UnauthorizedException()
        }

        const userData = this.jwtService.validateToken(refreshToken)
        const tokenFromDb = await this.jwtService.findToken(refreshToken)

        if(!userData || !tokenFromDb){
            throw new UnauthorizedException()
        }

        const user = await this.userRepository.findOne({where: {id: userData.id}})

        const userDto = new CreateTokenDto(user)
        const tokens = this.jwtService.generateToken({...userDto})
        
        await this.jwtService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async getOneUser(userId: number){
        const user = await this.userRepository.findOne({where: {id: userId}})
        return user
    }

    async deleteUser(id: number){
        await this.userRepository.destroy({where: {id: id}})
    }

    async get_users() {
       return await this.userRepository.findAll()
    }
}
