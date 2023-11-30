import axios from "axios";
import { CurrencyWithAmount } from "../../entities/currency";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PROXY_API_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

export type ExchangeParams = {
  from: CurrencyWithAmount;
  to: CurrencyWithAmount;
};

export const getMinExchange = async ({ from, to }: ExchangeParams) => {
  const {
    data: { minAmount },
  } = await axiosInstance.get<MinExchangeResponse>(
    `min-amount?fromCurrency=${from.ticker}&toCurrency=${to.ticker}&fromNetwork=${from.network}&toNetwork=${to.network}&flow=standard`
  );

  return minAmount;
};

export const getEstimatedExchange = async ({ from, to }: ExchangeParams) => {
  const query = to.amount
    ? `estimated-amount?fromCurrency=${from.ticker}&toCurrency=${to.ticker}&toAmount=${to.amount}&fromNetwork=${from.network}&toNetwork=${to.network}&flow=standart&type=reverse`
    : `estimated-amount?fromCurrency=${from.ticker}&toCurrency=${to.ticker}&fromAmount=${from.amount}&fromNetwork=${from.network}&toNetwork=${to.network}&flow=standart&type=direct`;

  const {
    data: { fromAmount, toAmount },
  } = await axiosInstance.get<EstimatedExchangeResponse>(query);

  return { from: fromAmount, to: toAmount };
};

export const EXCHANGE_ERRORS = {
  PAIR_INACTIVE: "pair_is_inactive",
  AMOUNT_LESS_MIN: "less_min_amount",
} as const;


export interface MinExchangeResponse {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  flow: string;
  minAmount: number;
}


export interface EstimatedExchangeResponse {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  flow: string;
  type: string;
  rateId: string;
  validUntil: string;
  transactionSpeedForecast: null;
  warningMessage: null;
  depositFee: number;
  withdrawalFee: number;
  userId: null;
  fromAmount: number;
  toAmount: number;
}