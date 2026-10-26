import { baseApi } from "../../../services/api/baseApi.js";

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminProducts: builder.query({
      query: ({ page = 1, limit = 20, status } = {}) => {
        const params = { page, limit };
        if (status) params.status = status;

        return {
          url: "/products/admin",
          params,
        };
      },
      transformResponse: (response) => ({
        products: response.data,
        pagination: response.pagination,
      }),
      providesTags: [{ type: "AdminProducts", id: "LIST" }],
    }),

    createAdminProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "AdminProducts", id: "LIST" }, "Products"],
    }),

    updateAdminProduct: builder.mutation({
      query: ({ productId, updates }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: updates,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: "AdminProducts", id: "LIST" }, "Products"],
    }),

    deleteAdminProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminProducts", id: "LIST" }, "Products"],
    }),
  }),
});

export const {
  useListAdminProductsQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
} = adminProductsApi;