import { baseApi } from './baseApi.js'

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders', 'Cart'], // Invalidate cart after placing order
    }),
    getMyOrders: builder.query({
      query: () => ({ url: '/orders/me' }),
      providesTags: ['Orders'],
    }),
    getOrder: builder.query({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Orders'],
    }),
    requestRefund: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/orders/${orderId}/refund-request`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useRequestRefundMutation,
} = orderApi
