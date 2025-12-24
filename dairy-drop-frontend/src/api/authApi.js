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
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/me",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Me"]
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/auth/change-password', method: 'POST', body: data }),
    }),
    getUser: builder.query({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Me'],
    }),
    listAddresses: builder.query({
      query: () => ({ url: '/auth/addresses' }),
      providesTags: ['Me'],
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: '/auth/addresses',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Me'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/addresses/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Me'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/auth/addresses/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Me'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetUserQuery,
  useListAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = authApi
