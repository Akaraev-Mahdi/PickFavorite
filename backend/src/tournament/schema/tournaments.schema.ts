import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/auth/schema/user.schema";
import { Like } from "../../like/schema/like.schema";
import { Picture } from "./picture.schema";
import { Views } from "../../views/schema/views.schema";
import { PersonalPicturesResults } from "./personal-pictures-result.schema";
import { PassedTournaments } from "./passed.schema";

@Table({tableName: 'tournaments'})
export class Tournaments extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number

    @Column({type: DataType.STRING, allowNull: false})
    title: string

    @Column({type: DataType.STRING})
    description: string

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    completed: boolean

    @Column({type: DataType.STRING, allowNull: false})
    image: string

    //Связи между таблицами

    @BelongsTo(() => User)
    user: User[]

    @HasMany(() => Like)
    like: Like[]

    @HasMany(() => PersonalPicturesResults)
    personalPicturesResults: PersonalPicturesResults[]

    @HasMany(() => PassedTournaments)
    passedTournaments: PassedTournaments[]

    @HasMany(() => Views)
    views: Views[]

    @HasMany(() => Picture)
    picture: Picture[]
}