import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator"

export class RegistrationUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(4, 16, {message: 'Должно быть не больше 16 и не меньше 4 символов'})
    @Matches(/^[a-zA-Z0-9\s]*$/, {message: 'Допустимы только латиница и цифры'})
    readonly username: string
    
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @Length(4, 16, {message: 'Должно быть не больше 16 и не меньше 4 символов'})
    @Matches(/^[a-zA-Z0-9\s]*$/, {message: 'Допустимы только латиница и цифры'})
    readonly password: string
}