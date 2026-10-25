import { baseApi } from "../../../services/api/baseApi.js";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      transformResponse: (response) => response.data,
      providesTags: ["Cart"],
    }),

    addCartItem: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: "/cart/items",
        method: "POST",
        body: { productId, quantity },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
