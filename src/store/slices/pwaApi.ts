import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../middlewares/authBaseQuery";
import { PwaContent } from "@models/pwa";
import { get } from "http";

export const pwaSlice = createApi({
  reducerPath: "pwaApi",
  baseQuery: baseQuery,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    createPwaContent: builder.mutation<null, PwaContent>({
      query: (data) => ({
        url: "/pwa-content",
        method: "POST",
        body: data,
      }),
    }),
    deletePwaContent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/pwa-content/${id}`,
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
  }),
});

export const {
  useCreatePwaContentMutation,
  useGetAllPwaContentQuery,
  useDeletePwaContentMutation,
  useCopyPwaContentMutation,
} = pwaSlice;
