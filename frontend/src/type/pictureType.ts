export interface IPicture {
    id: number,
    tournamentId: number,
    title: string,
    description: string,
    image: string,
    score: number,
}

export interface IPictureWithInfo {
    id: number,
    tournamentId: number,
    pictureId: number,
    userId: number
    score: number,
    picture: IPicture
}