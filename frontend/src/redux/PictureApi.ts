import type { IPicture } from '../type/pictureType';
import { api } from './api';

const PictureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTournamentPictures: builder.query<IPicture[], string | void>({
      query: (body) => ({
        url: `tournament/${body}`,
      })
    }),
    getPersonalTournamentPictures: builder.query({
      query: (body) => ({
        url: `tournament/get-personal-pictures/${body}`,
      })
    }),
    addScore: builder.mutation({
      query: (body) => ({
        url: 'tournament/add-score',
        method: 'POST',
        body
      })
    }),
    deletePicture: builder.mutation({
      query: (body) => ({
        url: 'tournament/delete-picture',
        method: 'DELETE',
        body
      })
    }),
    createVoiter: builder.mutation({
      query: (body) => ({
        url: 'tournament/create-picture',
        method: 'POST',
        body
      }),
    }),
  }),
});

export const {
  useGetTournamentPicturesQuery,
  useCreateVoiterMutation,
  useAddScoreMutation,
  useLazyGetPersonalTournamentPicturesQuery,
  useDeletePictureMutation
} = PictureApi;