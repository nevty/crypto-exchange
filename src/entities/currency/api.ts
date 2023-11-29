import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseCryptoQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_PROXY_API_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

export const currenciesApi = createApi({
  reducerPath: "currenciesApi",
  baseQuery: baseCryptoQuery,
  endpoints: (builder) => ({
    getCurrencyOptions: builder.query<CurrencyOption[], void>({
      query: () => "currencies?active=&flow=standard&buy=&sell=",
      transformResponse: (response: CurrenciesResponse[]) =>
        response.map((option) => ({
          ...option,
          id: option.ticker,
          label: option.name,
        })),
    }),
  }),
});

export const {
  useGetCurrencyOptionsQuery
} = currenciesApi;

export interface CurrenciesResponse {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  network: string;
  tokenContract: null;
  buy: boolean;
  sell: boolean;
  legacyTicker: string;
}

export interface CurrencyOption extends CurrenciesResponse {
  id: string;
  label: string;
}

export interface CurrencyWithAmount extends CurrencyOption {
  amount?: number | null;
  minAmount?: number;
}
