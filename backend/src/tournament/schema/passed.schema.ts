import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tournaments } from "./tournaments.schema";
import { User } from "src/auth/schema/user.schema";

@Table({tableName: 'passed-tournaments'})
export class PassedTournaments extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => Tournaments)
    @Column({type: DataType.INTEGER, allowNull: false})
    tournamentId: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number

    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    passed: boolean

    //Связи между таблицами

    @BelongsTo(() => User)
    user: User[]

    @BelongsTo(() => Tournaments)
    tournaments: Tournaments[]
}