import { baseApi } from "./baseApi.js";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (payload) => ({
        url: "/payments/checkout-session",
        method: "POST",
        body: payload,
      }),
    }),
    verifyCheckoutSession: builder.mutation({
      query: (sessionId) => ({
        url: `/payments/checkout-session/${sessionId}/verify`,
        method: "GET",
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),
    markCheckoutSessionFailed: builder.mutation({
      query: (sessionId) => ({
        url: `/payments/checkout-session/${sessionId}/fail`,
        method: "POST",
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyCheckoutSessionMutation,
  useMarkCheckoutSessionFailedMutation,
} = paymentApi;
