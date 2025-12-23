import { baseApi } from './baseApi.js'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((p) => ({ type: 'Product', id: p._id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (r, e, id) => [{ type: 'Product', id }],
    }),
    getCategories: builder.query({
      query: () => ({ url: '/products/categories' }),
      providesTags: ['Categories'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (r, e, { id }) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}` , method: 'DELETE' }),
      invalidatesTags: (r, e, id) => [{ type: 'Product', id }, { type: 'Products', id: 'LIST' }],
    }),
  }),
})

export const {
  useListProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
