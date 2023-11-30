import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CurrencyOption, CurrencySelect } from "../../entities/currency";
import { changeCurrencyAmount, selectCurrency } from "./exchange-slice";

export const ExchangePair = () => {
  const dispatch = useAppDispatch();
  const { fromCurrency, toCurrency } = useAppSelector(
    (state) => ({
      fromCurrency: state.exchange.from,
      toCurrency: state.exchange.to,
    }),
    shallowEqual
  );

  const selectFromCurrency = (option: CurrencyOption | null) => {
    if (option !== null) dispatch(selectCurrency({ from: option }));
  };

  const handleSetFromCurrencyAmount = (amount: number) => {
    if (fromCurrency && toCurrency)
      dispatch(
        changeCurrencyAmount({
          from: { ...fromCurrency, amount },
          to: toCurrency,
        })
      );
  };

  const selectToCurrency = (option: CurrencyOption | null) => {
    if (option !== null) dispatch(selectCurrency({ to: option }));
  };

  const handleSetToCurrencyAmount = (amount: number) => {
    if (fromCurrency && toCurrency)
      dispatch(
        changeCurrencyAmount({
          from: fromCurrency,
          to: { ...toCurrency, amount },
        })
      );
  };

  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <CurrencySelect
        currency={fromCurrency}
        onSelect={selectFromCurrency}
        setCurrencyAmount={handleSetFromCurrencyAmount}
      />
      <CurrencySelect
        currency={toCurrency}
        onSelect={selectToCurrency}
        setCurrencyAmount={handleSetToCurrencyAmount}
      />
    </div>
  );
};
