import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../app/hooks";
import { ExchangePair } from "../../../features/exchange-pair";
import { AddressExchange } from "./address-exchange";

export const MainPage = () => {
  const { fromCurrency, toCurrency, isExchangeLoading, exchangeError } =
    useAppSelector(
      (state) => ({
        fromCurrency: state.exchange.from,
        toCurrency: state.exchange.to,
        exchangeError: state.exchange.error,
        isExchangeLoading: state.exchange.isLoading,
      }),
      shallowEqual
    );

  return (
    <div className="w-full max-w-6xl m-auto p-4">
      <div className="flex flex-col gap-4">
        <h1>Crypto Exchange</h1>
        <p>Exchange fast and easy</p>
      </div>
      <div className="mt-16">
        <ExchangePair />
        {fromCurrency && toCurrency && (
          <AddressExchange
            isLoading={isExchangeLoading}
            error={exchangeError}
            currency={toCurrency}
          />
        )}
      </div>
    </div>
  );
};
