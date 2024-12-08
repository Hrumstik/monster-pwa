import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../middlewares/authBaseQuery";
import { PwaContent } from "@models/pwa";
import { User } from "@models/user";
import { AddDomainResponse, DomainData } from "@models/domain";

export const pwaSlice = createApi({
  reducerPath: "pwaApi",
  baseQuery: baseQuery,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    createPwaContent: builder.mutation<PwaContent, PwaContent>({
      query: (data) => ({
        url: "/pwa-content",
        method: "POST",
        body: data,
      }),
    }),
    updatePwaContent: builder.mutation<PwaContent, PwaContent>({
      query: (data) => ({
        url: `/pwa-content/${data.id}`,
        method: "PATCH",
        body: { ...data, id: undefined },
      }),
    }),
    deletePwaContent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}`,
        method: "DELETE",
      }),
    }),
    deletePwaContentForced: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}/force`,
        method: "DELETE",
      }),
    }),
    copyPwaContent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}/copy`,
        method: "POST",
      }),
    }),
    getAllPwaContent: builder.query<PwaContent[], void>({
      query: () => "/pwa-content",
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
        body: body,
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
    }),
    addDomain: builder.mutation<AddDomainResponse, DomainData>({
      query: (data) => ({
        url: "/domains/add",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreatePwaContentMutation,
  useUpdatePwaContentMutation,
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
} = pwaSlice;
