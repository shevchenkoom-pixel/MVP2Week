import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { AuthUser } from "./authSlice";

export interface FakeLoginRequest {
  display_name?: string;
}

export interface FakeLoginResponse {
  token: string;
  user: AuthUser;
}

export interface CatalogTemplate {
  name: string;
  description: string;
  filename: string;
  source_repo: string;
}

export interface CatalogResponse {
  templates: CatalogTemplate[];
}

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fakeLogin: builder.mutation<FakeLoginResponse, FakeLoginRequest | void>({
      query: (body) => ({
        url: "/auth/fake-login",
        method: "POST",
        body: body ?? {},
      }),
    }),
    getCatalog: builder.query<CatalogResponse, void>({
      query: () => "/api/catalog",
    }),
  }),
});

export const { useFakeLoginMutation, useGetCatalogQuery } = api;