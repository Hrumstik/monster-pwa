import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../middlewares/authBaseQuery";
import { DomainCheckStatus, PwaContent } from "@models/pwa";
import { User } from "@models/user";
import { DeploymentConfig, ReadyDomains } from "@models/domain";

export const pwaSlice = createApi({
  reducerPath: "pwaApi",
  keepUnusedDataFor: 3000,
  baseQuery: baseQuery,
  refetchOnFocus: true,
  tagTypes: ["PwaContent", "User", "ReadyDomains"],
  endpoints: (builder) => ({
    createPwaContent: builder.mutation<PwaContent, PwaContent>({
      query: (data) => ({
        url: "/pwa-content",
        method: "POST",
        body: data,
      }),
    }),
    updatePwaName: builder.mutation<
      PwaContent,
      {
        id: string;
        pwaName: string;
      }
    >({
      query: ({ id, pwaName }) => ({
        url: `/pwa-content/${id}`,
        method: "PATCH",
        body: { pwaName },
      }),
      invalidatesTags: ["PwaContent", "User"],
    }),
    updatePwaTags: builder.mutation<
      PwaContent,
      {
        id: string;
        pwaTags: string[];
      }
    >({
      query: ({ id, pwaTags }) => ({
        url: `/pwa-content/${id}`,
        method: "PATCH",
        body: { pwaTags },
      }),
      async onQueryStarted({ id, pwaTags }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          pwaSlice.util.updateQueryData(
            "getAllPwaContent",
            undefined,
            (draft) => {
              draft?.forEach((pwa) => {
                if (pwa._id === id) {
                  pwa.pwaTags = [...pwaTags];
                }
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Failed to update PWA tags", error);
        }
      },
    }),
    deletePwaContent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PwaContent", "User"],
    }),
    deletePwaContentForced: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}/force`,
        method: "DELETE",
      }),
      invalidatesTags: ["PwaContent", "User", "ReadyDomains"],
    }),
    copyPwaContent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}/copy`,
        method: "POST",
      }),
    }),
    getAllPwaContent: builder.query<PwaContent[], void>({
      query: () => "/pwa-content",
      providesTags: ["PwaContent"],
    }),
    getPwaContentById: builder.query<PwaContent, string>({
      query: (id) => `/pwa-content/${id}`,
    }),

    buildPwaContent: builder.mutation<{ jobId: string }, DeploymentConfig>({
      query: ({ id, body }) => ({
        url: `/pwa-content/${id}/buildAndDeploy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReadyDomains"],
    }),
    getPwaContentStatus: builder.query<
      { status: string; url?: string; body?: string },
      string
    >({
      query: (pwaContentId) => ({
        url: `/pwa-content/status/${pwaContentId}`,
        method: "GET",
      }),
    }),
    getMyUser: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    checkDomainStatus: builder.query<DomainCheckStatus, string>({
      query: (pwaContentId) => ({
        url: `/domains/${pwaContentId}/check-status`,
        responseHandler: "text",
      }),
      transformResponse: (response: string) =>
        response.trim() as DomainCheckStatus,
    }),
    getReadyDomains: builder.query<ReadyDomains[], void>({
      query: () => "/ready-domain",
      providesTags: ["ReadyDomains"],
    }),
    generateReviewDate: builder.query<
      {
        reviewText: string;
        reviewAuthor: string;
        reviewResponse: string;
      },
      void
    >({
      query: () => "/chat-gpt/generate-review",
    }),
    generateAppDescription: builder.query<
      {
        text: string;
      },
      void
    >({
      query: () => ({
        url: "/chat-gpt/generate-app-description",
      }),
    }),
    generateReviewText: builder.query<{ text: string }, void>({
      query: () => ({
        url: "/chat-gpt/generate-review-text",
      }),
    }),
    getDomainAnalytics: builder.query<
      {
        opens: number;
        installs: number;
        registrations: number;
        deposits: number;
      },
      {
        pwaContentId: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({ pwaContentId, startDate, endDate }) => ({
        url:
          startDate && endDate
            ? `/pwa-event-log/stats?pwaContentId=${pwaContentId}&startDate=${startDate}&endDate=${endDate}`
            : `/pwa-event-log/stats?pwaContentId=${pwaContentId}`,
        method: "GET",
      }),
    }),
    generateResponseText: builder.mutation<
      { text: string },
      {
        text: string;
      }
    >({
      query: ({ text }) => ({
        url: "/chat-gpt/generate-review-response-text",
        method: "POST",
        body: { text },
      }),
    }),
  }),
});

export const {
  useCreatePwaContentMutation,
  useUpdatePwaNameMutation,
  useGetAllPwaContentQuery,
  useDeletePwaContentMutation,
  useDeletePwaContentForcedMutation,
  useCopyPwaContentMutation,
  useLazyGetPwaContentStatusQuery,
  useBuildPwaContentMutation,
  useLazyGetPwaContentByIdQuery,
  useGetPwaContentByIdQuery,
  useGetMyUserQuery,
  useLazyCheckDomainStatusQuery,
  useGetReadyDomainsQuery,
  useUpdatePwaTagsMutation,
  useLazyGenerateReviewDateQuery,
  useLazyGenerateAppDescriptionQuery,
  useLazyGenerateReviewTextQuery,
  useGenerateResponseTextMutation,
  useLazyGetDomainAnalyticsQuery,
} = pwaSlice;
