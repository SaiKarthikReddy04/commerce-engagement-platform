import { baseApi } from "../../../services/api/baseApi.js";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body = {}) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart", "Orders"],
    }),

    listOrders: builder.query({
      query: () => "/orders",
      transformResponse: (response) => ({
        orders: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map((order) => ({
                type: "Orders",
                id: order._id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, orderId) => [
        { type: "Orders", id: orderId },
      ],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useListOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi;
