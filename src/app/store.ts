import { configureStore } from "@reduxjs/toolkit";
import { exchangeSlice } from "../features/exchange-pair";
import { currenciesApi } from "../entities/currency";

export const store = configureStore({
  reducer: {
    [currenciesApi.reducerPath]: currenciesApi.reducer,
    exchange: exchangeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(currenciesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
