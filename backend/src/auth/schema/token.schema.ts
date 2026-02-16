import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.schema";

@Table({tableName: 'token'})
export class Token extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number
    
    @Column({type: DataType.STRING, allowNull: false})
    refreshToken: string

    //Связи между таблицами

    @BelongsTo(() => User)
    user: User[]
}