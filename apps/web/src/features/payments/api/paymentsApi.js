import { baseApi } from "../../../services/api/baseApi.js";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    simulatePayment: builder.mutation({
      query: ({ orderId, outcome }) => ({
        url: `/payments/${orderId}/simulate`,
        method: "POST",
        body: { outcome },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const { useSimulatePaymentMutation } = paymentsApi;
