import cx from "clsx";
import { CurrencyWithAmount } from "../../../entities/currency";

type AddressExchangeProps = {
  isLoading?: boolean;
  error: string | null;
  currency: CurrencyWithAmount;
};

export const AddressExchange = ({
  error,
  currency,
  isLoading,
}: AddressExchangeProps) => (
  <div className="flex flex-col mt-8 gap-2">
    <p>Your {currency.name} address</p>
    <div className="flex gap-8 flex-col sm:flex-row">
      <input
        type="text"
        className={cx(
          "outline outline-0 px-3 py-2",
          "h-[50px] flex-grow text-md",
          "rounded-md border-2",
          "border-[#E3EBEF] bg-[#F6F7F8] text-[#282828]"
        )}
      />
      <div className="w-full sm:max-w-[200px] text-center">
        <button
          className={cx(
            "w-full min-h-[50px]",
            "bg-[#11B3FE] hover:bg-[#0095E0] text-white",
            "disabled:bg-gray-500 disabled:hover:bg-gray-500"
          )}
          disabled={!!error || isLoading}
        >
          EXCHANGE
        </button>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  </div>
);
