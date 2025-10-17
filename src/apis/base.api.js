import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:3000/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: [
    "tower-log",
  ],
  refetchOnFocus: true,
  endpoints: () => ({}),
});
