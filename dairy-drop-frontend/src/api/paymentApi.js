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
  }),
});

export const { useCreateCheckoutSessionMutation } = paymentApi;
