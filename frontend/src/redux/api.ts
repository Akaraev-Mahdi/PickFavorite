import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const getToken = () => {
    return localStorage.getItem('token') || ''
}

const rawBaseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5000/', prepareHeaders: (headers) => { 
  const token = getToken()
  if(token){
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}, credentials: 'include'})

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery('auth/refresh', api, extraOptions);
    if (refreshResult.data) {
      localStorage.setItem('token', refreshResult.data.accessToken)

      return rawBaseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});