import type { ITournament } from '../type/tournamentType';
import { api } from './api';

const ViewsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ViewTournament: builder.mutation({
      query: (body) => ({
        url: `views/${body}`,
        method: 'POST'
      }),
    }),
    getViewedTournaments: builder.query<ITournament[], void>({
      query: () => 'views/get-view-tournaments',
    }),
  }),
});

export const {
  useLazyGetViewedTournamentsQuery,
  useViewTournamentMutation
} = ViewsApi;