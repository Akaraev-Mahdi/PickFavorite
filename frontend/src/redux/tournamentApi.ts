import type { ITournament } from '../type/tournamentType';
import { api } from './api';

const TournamentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTournaments: builder.query<ITournament[], void>({
      query: () => 'tournament',
    }),
    getCreatedTournaments: builder.query<ITournament[], void>({
      query: () => 'tournament/get-created-tournaments'
    }),
    createTournament: builder.mutation({
      query: (body) => ({
        url: 'tournament/create-tournament',
        method: 'POST',
        body
      }),
    }),
    completedTournament: builder.mutation({
      query: (body) => ({
        url: `tournament/tournament-complited/${body}`,
        method: 'PUT'
      }),
    }),
    chekTournamentCompleted: builder.mutation<void, void>({
      query: () => ({
        url: 'tournament/chek-tournament-complited',
        method: 'POST'
      })
    }),
  }),
});

export const { 
  useCreateTournamentMutation,
  useLazyGetCreatedTournamentsQuery,
  useCompletedTournamentMutation, 
  useChekTournamentCompletedMutation, 
  useGetTournamentsQuery,
} = TournamentApi;