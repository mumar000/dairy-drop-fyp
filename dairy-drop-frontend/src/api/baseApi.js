import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../utils/storage.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Product', 'Products', 'Me', 'Order', 'Orders', 'Review', 'Cart'],
  endpoints: () => ({}),
})

