interface addScore {
    pictureId: number,
    score: number
}

export class AddScoreDto {
    readonly tournamentId: number
    readonly pictures: addScore[]
}