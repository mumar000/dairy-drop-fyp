import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (productData) => {
        // Check if productData is FormData (for file uploads)
        const isFormData = productData instanceof FormData;

        const req = {
          url: '/products',
          method: 'POST',
          body: productData,
        };

        // Don't set Content-Type for FormData as it will be set automatically
        if (!isFormData) {
          req.headers = { 'Content-Type': 'application/json' };
        }

        return req;
      },
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (arg) => {
        // Handle the case where arg is an object with id and _formData
        if (arg && typeof arg === 'object' && arg.id) {
          if (arg._formData) {
            // This is the case where we have FormData in _formData property
            const req = {
              url: `/products/${arg.id}`,
              method: 'PATCH',
              body: arg._formData,
            };
            // Don't set Content-Type for FormData as it will be set automatically
            return req;
          } else {
            // This is the case where arg contains the data directly
            const { id, ...productData } = arg;
            const isFormData = productData instanceof FormData;

            const req = {
              url: `/products/${id}`,
              method: 'PATCH',
              body: productData,
            };

            // Don't set Content-Type for FormData as it will be set automatically
            if (!isFormData) {
              req.headers = { 'Content-Type': 'application/json' };
            }

            return req;
          }
        } else {
          // Handle case where arg is just FormData (shouldn't happen in our case)
          throw new Error('Invalid arguments for updateProduct: id is required');
        }
      },
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Orders
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => {
        // Capitalize the status for backend compatibility
        const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        return {
          url: `/orders/${id}/status`,
          method: 'PATCH',
          body: { status: capitalizedStatus },
          headers: { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  // Product queries/mutations
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // User queries/mutations
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,

  // Order queries/mutations
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = adminApi