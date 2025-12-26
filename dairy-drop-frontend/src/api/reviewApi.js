import { baseApi } from './baseApi.js'

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId }
      ],
    }),
    updateMyReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/reviews/product/${productId}`,
        method: 'PUT',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId }
      ],
    }),
    listProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 5 }) => ({
        url: `/reviews/product/${productId}?page=${page}&limit=${limit}`
      }),
      providesTags: (result, error, { productId }) => [
        { type: 'Review', id: productId }
      ],
    }),
    deleteMyReview: builder.mutation({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, productId) => [
        { type: 'Review', id: productId },
        { type: 'Product', id: productId }
      ],
    }),
  }),
})

export const {
  useAddReviewMutation,
  useUpdateMyReviewMutation,
  useListProductReviewsQuery,
  useDeleteMyReviewMutation,
} = reviewApi