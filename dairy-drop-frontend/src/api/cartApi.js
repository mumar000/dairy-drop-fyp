import { baseApi } from './baseApi.js'

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({ url: '/auth/cart' }),
      transformResponse: (response) => response.cart,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: '/auth/cart',
        method: 'POST',
        body: cartItem,
      }),
      transformResponse: (response) => response.cart,
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: (cartItem) => ({
        url: '/auth/cart',
        method: 'PATCH',
        body: cartItem,
      }),
      transformResponse: (response) => response.cart,
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/auth/cart/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.cart,
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/auth/cart',
        method: 'DELETE',
      }),
      transformResponse: (response) => response.cart,
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi