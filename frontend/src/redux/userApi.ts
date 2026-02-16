import { api } from './api';

const UserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'auth/get-users',
    }),
    registrationUser: builder.mutation({
      query: (body) => ({
        url: 'auth/registration',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled
          localStorage.setItem('token', data.accessToken)
        } catch (error) {
          console.error(error)
        }
      }
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled
          localStorage.setItem('token', data.accessToken)
        } catch (error) {
          console.error(error)
        }
      }
    }),
    chekAuth: builder.query({
      query: () => 'auth/refresh',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled
          localStorage.setItem('token', data.accessToken)
        } catch (error) {
          console.error(error)
        }
      }
    })
  }),
});

export const { useGetUsersQuery, useRegistrationUserMutation, useLoginUserMutation, useLazyChekAuthQuery } = UserApi;