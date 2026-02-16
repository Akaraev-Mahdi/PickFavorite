import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tournaments } from "./tournaments.schema";
import { User } from "src/auth/schema/user.schema";
import { Picture } from "./picture.schema";

@Table({tableName: 'personal-pictures-result'})
export class PersonalPicturesResults extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => Tournaments)
    @Column({type: DataType.INTEGER, allowNull: false})
    tournamentId: number

    @ForeignKey(() => Picture)
    @Column({type: DataType.INTEGER, allowNull: false})
    pictureId: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    score: number

    //Связи между таблицами

    @BelongsTo(() => User)
    user: User[]

    @BelongsTo(() => Tournaments)
    tournaments: Tournaments[]

    @BelongsTo(() => Picture)
    picture: Picture[]
}