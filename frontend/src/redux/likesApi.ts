import type { ITournament } from '../type/tournamentType';
import { api } from './api';

const LikeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    likeTournament: builder.mutation({
      query: (body) => ({
        url: `like/like-tournament/${body}`,
        method: 'POST'
      }),
    }),
    unLikeTournament: builder.mutation({
      query: (body) => ({
        url: `like/unlike-tournament/${body}`,
        method: 'DELETE'
      }),
    }),
    getLikedTournaments: builder.query<ITournament[], void>({
      query: () => 'like/get-like-tournament',
    }),
  }),
});

export const { 
  useGetLikedTournamentsQuery,
  useLikeTournamentMutation,
  useUnLikeTournamentMutation
} = LikeApi;