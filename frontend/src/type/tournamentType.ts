export type activityType = {
    id: number,
    tournamentId: number,
    userId: number
}

export interface ITournament {
    id: number,
    userId: number,
    title: string,
    description: string,
    completed: boolean,
    image: string,
    like: activityType[],
    views: activityType[],
    likedByUser?: boolean
}