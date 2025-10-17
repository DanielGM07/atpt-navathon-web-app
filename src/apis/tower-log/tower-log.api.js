import { baseApi } from "../base.api";

export const towerLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /tower-log?from=&to=  (from/to son opcionales; si no los mandás, trae todo)
    listTowerLogs: builder.query({
      query: ({ from, to } = {}) => {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        const qs = params.toString();
        return {
          url: `/tower-log${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((row) => ({ type: "tower-log", id: row.id })),
              { type: "tower-log", id: "LIST" },
            ]
          : [{ type: "tower-log", id: "LIST" }],
    }),

    // GET /tower-log/latest
    getLatestTowerLog: builder.query({
      query: () => ({ url: "/tower-log/latest", method: "GET" }),
      providesTags: (result) =>
        result
          ? [{ type: "tower-log", id: result.id }, { type: "tower-log", id: "LATEST" }]
          : [{ type: "tower-log", id: "LATEST" }],
    }),

    // GET /tower-log/:id
    getTowerLogById: builder.query({
      query: (id) => ({ url: `/tower-log/${id}`, method: "GET" }),
      providesTags: (result, _err, id) => [{ type: "tower-log", id }],
    }),

    // POST /tower-log
    createTowerLog: builder.mutation({
      query: (payload) => ({
        url: `/tower-log`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "tower-log", id: "LIST" }, { type: "tower-log", id: "LATEST" }],
    }),

    // PATCH /tower-log/:id
    updateTowerLog: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/tower-log/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "tower-log", id },
        { type: "tower-log", id: "LIST" },
        { type: "tower-log", id: "LATEST" },
      ],
    }),

    // DELETE /tower-log/:id
    deleteTowerLog: builder.mutation({
      query: (id) => ({
        url: `/tower-log/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "tower-log", id },
        { type: "tower-log", id: "LIST" },
        { type: "tower-log", id: "LATEST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListTowerLogsQuery,
  useGetLatestTowerLogQuery,
  useGetTowerLogByIdQuery,
  useCreateTowerLogMutation,
  useUpdateTowerLogMutation,
  useDeleteTowerLogMutation,
} = towerLogApi;
