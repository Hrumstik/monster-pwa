import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../middlewares/authBaseQuery";
import { DomainCheckStatus, PwaContent } from "@models/pwa";
import { User } from "@models/user";
import {
  AddDomainResponse,
  AttachReadyDomainResponse,
  DomainData,
  ReadyDomains,
} from "@models/domain";

export const pwaSlice = createApi({
  reducerPath: "pwaApi",
  baseQuery: baseQuery,
  refetchOnFocus: true,
  tagTypes: ["PwaContent", "User"],
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
      invalidatesTags: ["PwaContent", "User"],
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

    buildPwaContent: builder.query<
      { jobId: string },
      {
        id: string;
        body?: {
          domain?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/pwa-content/${id}/build`,
        method: "POST",
        body,
      }),
    }),
    getPwaContentStatus: builder.query<
      { status: string; url?: string; body?: string },
      string
    >({
      query: (jobId) => ({
        url: `/pwa-content/status/${jobId}`,
        method: "GET",
      }),
    }),
    getMyUser: builder.query<User, void>({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    addDomain: builder.mutation<AddDomainResponse, DomainData>({
      query: (data) => ({
        url: "/domains/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "PwaContent"],
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
    }),
    attachReadyDomain: builder.mutation<
      AttachReadyDomainResponse,
      { id: string; pwaId: string; userId: string }
    >({
      query: ({ id, pwaId, userId }) => ({
        url: `/ready-domain/${id}/attach`,
        method: "PATCH",
        body: { pwaId, userId },
      }),
      invalidatesTags: ["User", "PwaContent"],
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
  useLazyBuildPwaContentQuery,
  useLazyGetPwaContentByIdQuery,
  useGetPwaContentByIdQuery,
  useGetMyUserQuery,
  useAddDomainMutation,
  useLazyCheckDomainStatusQuery,
  useGetReadyDomainsQuery,
  useAttachReadyDomainMutation,
} = pwaSlice;
