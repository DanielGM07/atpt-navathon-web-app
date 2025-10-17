import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../apis/base.api";
import { setupListeners } from "@reduxjs/toolkit/query";

// Si tenés otros reducers, impórtalos y agrégalos acá
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    // other: otherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Opcional: reintentos/cancelaciones on focus/refetchOnReconnect
setupListeners(store.dispatch);
