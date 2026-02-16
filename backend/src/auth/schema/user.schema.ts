import { Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Token } from "./token.schema";
import { Tournaments } from "../../tournament/schema/tournaments.schema";
import { Like } from "src/like/schema/like.schema";
import { Views } from "src/views/schema/views.schema";
import { PersonalPicturesResults } from "../../tournament/schema/personal-pictures-result.schema";
import { PassedTournaments } from "../../tournament/schema/passed.schema";

@Table({tableName: 'user'})
export class User extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number
    
    @Column({type: DataType.STRING, allowNull: false})
    username: string

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string

    @Column({type: DataType.STRING, allowNull: false})
    password: string

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    isActivated: boolean

    @Column({type: DataType.STRING})
    activationLink: string

    //Связи между таблицами

    @HasOne(() => Token)
    token: Token

    @HasMany(() => Tournaments)
    tournaments: Tournaments[]

    @HasMany(() => PersonalPicturesResults)
    personalPicturesResults: PersonalPicturesResults[]

    @HasMany(() => PassedTournaments)
    passedTournaments: PassedTournaments[]

    @HasMany(() => Like)
    like: Like[]

    @HasMany(() => Views)
    views: Views[]
}