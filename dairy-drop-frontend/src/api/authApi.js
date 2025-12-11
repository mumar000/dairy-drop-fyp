import { baseApi } from './baseApi.js'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
      invalidatesTags: ['Me'],
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
      invalidatesTags: ['Me'],
    }),
    me: builder.query({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Me'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/auth/change-password', method: 'POST', body: data }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useMeQuery, useChangePasswordMutation } = authApi

