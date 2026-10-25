import { baseApi } from "../../../services/api/baseApi.js";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query({
      query: ({
        search = "",
        category = "",
        sort = "newest",
        page = 1,
        limit = 12,
      } = {}) => {
        const params = { sort, page, limit };

        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;

        return {
          url: "/products",
          params,
        };
      },
      transformResponse: (response) => ({
        products: response.data,
        pagination: response.pagination,
      }),
      providesTags: ["Products"],
    }),

    listCategories: builder.query({
      query: () => "/products/categories",
      transformResponse: (response) => response.data,
    }),

    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      transformResponse: (response) => response.data,
      providesTags: (_result, _error, productId) => [
        { type: "Products", id: productId },
      ],
    }),
  }),
});

export const {
  useListProductsQuery,
  useListCategoriesQuery,
  useGetProductByIdQuery,
} = catalogApi;
