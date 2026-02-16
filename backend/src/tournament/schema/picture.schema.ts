import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Tournaments } from "./tournaments.schema";
import { PersonalPicturesResults } from "./personal-pictures-result.schema";

@Table({tableName: 'picture'})
export class Picture extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => Tournaments)
    @Column({type: DataType.INTEGER, allowNull: false})
    tournamentId: number

    @Column({type: DataType.STRING, allowNull: false})
    title: string

    @Column({type: DataType.STRING})
    description: string

    @Column({type: DataType.STRING, allowNull: false})
    image: string

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    score: number

    //Связи между таблицами

    @BelongsTo(() => Tournaments)
    tournaments: Tournaments[]

    @HasMany(() => PersonalPicturesResults)
    personalPicturesResults: PersonalPicturesResults[]
}