import { isAxiosError } from "axios";
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CurrencyWithAmount } from "../../entities/currency";
import { getMinExchange, getEstimatedExchange, EXCHANGE_ERRORS, ExchangeParams } from "./api";

export const selectCurrency = createAsyncThunk<
  void,
  Partial<ExchangeParams>
>(
  "exchange/min-amount",
  async ({ from, to }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { exchange: exchangeState } = state;
    try {
      if (from && !to) {
        dispatch(setFromCurrency(from));
        if (exchangeState.to) {
          const amount = await getMinExchange({ from, to: exchangeState.to });
          dispatch(setFromCurrencyAmount(amount));
          dispatch(setFromCurrencyMinAmount(amount));
          // get estimated toCurrency amount
          dispatch(changeCurrencyAmount({from: {...from, amount}, to: exchangeState.to}))
        }
      } else if (to && !from) {
        dispatch(setToCurrency(to));
        if (exchangeState.from) {
          const amount = await getMinExchange({ to, from: exchangeState.from });
          dispatch(setFromCurrencyAmount(amount));
          dispatch(setFromCurrencyMinAmount(amount));
          // get estimated fromCurrency amount
          dispatch(changeCurrencyAmount({from: exchangeState.from, to: {...to, amount}}))
        }
      } else if (from && to) {
        dispatch(setFromCurrency(from));
        dispatch(setToCurrency(to));
        const amount = await getMinExchange({ from, to });
        dispatch(setFromCurrencyAmount(amount));
        dispatch(setFromCurrencyMinAmount(amount));
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.error)
        return rejectWithValue(error.response.data.error);
    }
  }
);

export const changeCurrencyAmount = createAsyncThunk<
  void,
  ExchangeParams
>(
  "exchange/min-amount",
  async ({ from, to }, { dispatch, rejectWithValue }) => {
    try {
      if (from.amount && from.minAmount && from.amount < from.minAmount) {
        // less than minimum
        dispatch(setFromCurrencyAmount(from.amount));
        dispatch(setToCurrencyAmount(null));
        return rejectWithValue(EXCHANGE_ERRORS.AMOUNT_LESS_MIN);
      } else if (from.amount) {
        // direct exchange
        dispatch(setFromCurrencyAmount(from.amount));
        const amount = await getEstimatedExchange({ from, to });
        dispatch(setToCurrencyAmount(amount.to));
      } else if (to.amount) {
        // reverse exchange
        dispatch(setFromCurrencyAmount(to.amount));
        const amount = await getEstimatedExchange({ from, to });
        dispatch(setToCurrencyAmount(amount.from));
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.error)
        return rejectWithValue(error.response.data.error);
    }
  }
);

type ExchangeState = {
  from: null | CurrencyWithAmount;
  to: null | CurrencyWithAmount;
  error: null | string;
  isLoading: boolean;
};

const initialState = {
  from: null,
  to: null,
  error: null,
  isLoading: false,
} as ExchangeState;

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState: initialState,
  reducers: {
    setFromCurrency: (
      state,
      { payload }: PayloadAction<CurrencyWithAmount>
    ) => {
      state.from = { ...payload, amount: null };
    },
    setToCurrency: (state, { payload }: PayloadAction<CurrencyWithAmount>) => {
      state.to = { ...payload, amount: null };
    },
    setFromCurrencyAmount: (state, { payload }: PayloadAction<number>) => {
      if (state.from) state.from.amount = payload;
    },
    setFromCurrencyMinAmount: (state, { payload }: PayloadAction<number>) => {
      if (state.from) state.from.minAmount = payload;
    },
    setToCurrencyAmount: (state, { payload }: PayloadAction<number | null>) => {
      if (state.to) state.to.amount = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isPending(selectCurrency, changeCurrencyAmount),
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      isFulfilled(selectCurrency, changeCurrencyAmount),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isRejectedWithValue(selectCurrency, changeCurrencyAmount),
      (state, { payload }) => {
        if (payload === EXCHANGE_ERRORS.PAIR_INACTIVE)
          state.error = "This pair is disabled now";
        if (payload === EXCHANGE_ERRORS.AMOUNT_LESS_MIN)
          state.error = "Amount is less than the minimum";
      }
    );
  },
});

export const {
  setFromCurrency,
  setToCurrency,
  setFromCurrencyAmount,
  setFromCurrencyMinAmount,
  setToCurrencyAmount,
} = exchangeSlice.actions;
