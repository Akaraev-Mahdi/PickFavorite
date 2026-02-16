import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tournaments } from "../../tournament/schema/tournaments.schema";
import { User } from "src/auth/schema/user.schema";

@Table({tableName: 'views'})
export class Views extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => Tournaments)
    @Column({type: DataType.INTEGER, allowNull: false})
    tournamentId: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number

    //Связи между таблицами

    @BelongsTo(() => User)
    user: User[]

    @BelongsTo(() => Tournaments)
    tournaments: Tournaments[]
}