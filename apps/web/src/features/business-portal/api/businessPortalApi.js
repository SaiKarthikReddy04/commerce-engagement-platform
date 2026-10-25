import { baseApi } from "../../../services/api/baseApi.js";

export const businessPortalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["Organizations"],
    }),

    getOrganizationMembers: builder.query({
      query: (organizationId) => `/organizations/${organizationId}/members`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, organizationId) => [
        { type: "OrganizationMembers", id: organizationId },
      ],
    }),

    addOrganizationMember: builder.mutation({
      query: ({ organizationId, email, role }) => ({
        url: `/organizations/${organizationId}/members`,
        method: "POST",
        body: { email, role },
      }),
      transformResponse: (response) => response.data.membership,
      invalidatesTags: (result, error, { organizationId }) => [
        { type: "OrganizationMembers", id: organizationId },
      ],
    }),

    getPendingOrganizationOrders: builder.query({
      query: ({ organizationId, page = 1, limit = 20 }) => ({
        url: `/organizations/${organizationId}/orders/pending-approval`,
        params: { page, limit },
      }),
      transformResponse: (response) => ({
        orders: response.data,
        pagination: response.pagination,
      }),
      providesTags: (result, error, { organizationId }) => [
        { type: "OrganizationOrders", id: organizationId },
      ],
    }),

    reviewOrganizationOrder: builder.mutation({
      query: ({ organizationId, orderId, decision }) => ({
        url: `/organizations/${organizationId}/orders/${orderId}/review`,
        method: "POST",
        body: { decision },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { organizationId }) => [
        { type: "OrganizationOrders", id: organizationId },
        "Orders",
      ],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useGetPendingOrganizationOrdersQuery,
  useReviewOrganizationOrderMutation,
} = businessPortalApi;
