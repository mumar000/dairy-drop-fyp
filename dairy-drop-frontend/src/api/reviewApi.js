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
    listProductReviews: builder.query({
      query: (productId) => ({ url: `/reviews/product/${productId}` }),
      providesTags: (result, error, productId) => [
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
  useListProductReviewsQuery,
  useDeleteMyReviewMutation,
} = reviewApi