import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../../middlewares/authBaseQuery";
import { PushEvent } from "@Routes/PushEditor/PushEditor";

export const pushSlice = createApi({
  reducerPath: "pushApi",
  baseQuery: baseQuery,
  tagTypes: ["Push"],
  refetchOnFocus: true,
  endpoints: (builder) => ({
    createPush: builder.mutation<void, PushEvent>({
      query: (pushEvent) => ({
        url: `/push`,
        method: "POST",
        body: pushEvent,
      }),
      invalidatesTags: ["Push"],
    }),
    getPushes: builder.query<PushEvent[], void>({
      query: () => `/push`,
      providesTags: ["Push"],
    }),
    editPush: builder.mutation<void, { id: string; data: Partial<PushEvent> }>({
      query: ({ id, data }) => ({
        url: `/push/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Push"],
    }),
    deletePush: builder.mutation<void, string>({
      query: (id) => ({
        url: `/push/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Push"],
    }),
    duplicatePush: builder.mutation<void, string>({
      query: (id) => ({
        url: `/push/duplicate/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Push"],
    }),
    getPush: builder.query<PushEvent, string>({
      query: (id) => `/push/${id}`,
      providesTags: ["Push"],
    }),
    testPush: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/push/test/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreatePushMutation,
  useGetPushesQuery,
  useEditPushMutation,
  useDeletePushMutation,
  useDuplicatePushMutation,
  useGetPushQuery,
  useTestPushMutation,
} = pushSlice;
