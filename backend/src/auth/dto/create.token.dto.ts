type createTokenDtoType = {
    id: number,
    username: string,
    email: string,
    isActivated: boolean
}

export class CreateTokenDto {
    id: number;
    username: string;
    email: string;
    isActivated: boolean;

    constructor(model: createTokenDtoType){
        this.id = model.id
        this.username = model.username
        this.email = model.email
        this.isActivated = model.isActivated
    }
}