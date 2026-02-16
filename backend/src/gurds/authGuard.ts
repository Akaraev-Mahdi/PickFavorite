import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Jwt_Service } from "src/auth/jwt.service";

@Injectable()
export class authGuard implements CanActivate {
    constructor(private jwtService: Jwt_Service){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const authHeader = req.headers.authorization

        if(!authHeader){
            throw new UnauthorizedException({message: 'Пользователь не найден'})
        }

        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]

        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }

        const decodeUser: any = this.jwtService.validateToken(token)

        if(!decodeUser){
            throw new UnauthorizedException({message: 'Нет доступа'})
        }else {
            if(decodeUser.isActivated !== true){
                throw new UnauthorizedException({message: 'Неактивирована почта'})
            }
            return true
        }
    }
}