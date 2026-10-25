import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState().auth?.accessToken || localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Cart",
    "Products",
    "Orders",
    "AdminProducts",
    "Organizations",
    "OrganizationMembers",
    "OrganizationOrders",
  ],
  endpoints: () => ({}),
});
