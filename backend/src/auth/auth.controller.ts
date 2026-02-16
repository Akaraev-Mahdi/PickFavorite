import { Body, Controller, Delete, Get, Logger, Param, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationUserDto } from './dto/registration.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { request, response } from 'express';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UsePipes(ValidationPipe)
    @Post('registration')
    async registration(@Body() dto: RegistrationUserDto, @Res() res: typeof response){
        const userData = await this.authService.registration(dto)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.status(201).json(userData)
    }

    @Get('activate/:link')
    async activate(@Param('link') activationLink: string, @Res() res: typeof response){
        const isActivate = await this.authService.activation(activationLink)
        if(isActivate){
            return res.redirect('http://localhost:5173/')
        }
    }

    @UsePipes(ValidationPipe)
    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res() res: typeof response){
        const userData = await this.authService.login(dto)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    }

    @Post('logout')
    async logout(@Res() res: typeof response, @Req() req: typeof request){
        const {refreshToken} = req.cookies
        await this.authService.logout(refreshToken)
        res.clearCookie('refreshToken')
    }

    @Get('refresh')
    async refresh(@Res() res: typeof response, @Req() req: typeof request){
        const {refreshToken} = req.cookies
        const userData = await this.authService.refresh(refreshToken)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: number){
        await this.authService.deleteUser(id)
    }

    @Get('get-users')
    async get_users(@Res() res: typeof response){
        const users = await this.authService.get_users()
        return res.json(users)
    }

}
