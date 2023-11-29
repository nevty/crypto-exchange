import React, { useState } from "react";
import cx from "clsx";
import Select, {
  GroupBase,
  StylesConfig,
  components,
  createFilter,
} from "react-select";
import {
  CurrencyOption,
  CurrencyWithAmount,
  useGetCurrencyOptionsQuery,
} from "../api";

const customStyles: StylesConfig<
  CurrencyWithAmount,
  false,
  GroupBase<CurrencyWithAmount>
> = {
  valueContainer: (base) => ({
    ...base,
    padding: "4px 8px",
    backgroundColor: "#F6F7F8",
    borderRadius: "5px",
  }),
  menu: (base) => ({
    ...base,
    marginTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: "5px",
    backgroundColor: "#F6F7F8",
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "#F6F7F8",
    color: "#282828",
    borderWidth: "2px",
    borderColor: "#C1D9E5",
    borderRadius: "5px",
    minHeight: "50px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#80A2B6",
  }),
  option: (base) => ({
    ...base,
    backgroundColor: "#F6F7F8",
    ":hover": {
      backgroundColor: "#EAF1F7",
    },
    color: "#80A2B6",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};

type CurrencySelectProps = {
  onSelect: (value: CurrencyOption | null) => void;
  currency: CurrencyWithAmount | null;
  setCurrencyAmount: (value: number) => void;
  isCurrencyLoading?: boolean;
};

export const CurrencySelect = ({
  onSelect,
  currency,
  isCurrencyLoading,
  setCurrencyAmount: onAmountChange,
}: CurrencySelectProps) => {
  const { data: currencies, isLoading: isOptionsLoading } =
    useGetCurrencyOptionsQuery();
  const [isOpen, open] = useState(false);

  const isLoading = isCurrencyLoading || isOptionsLoading;

  return (
    <div className="w-full">
      <Select
        styles={customStyles}
        isLoading={isLoading}
        options={currencies}
        filterOption={createFilter({ ignoreAccents: false })}
        menuIsOpen={isOpen}
        onBlur={() => open(false)}
        onChange={(value) => {
          onSelect(value);
          open(false);
        }}
        placeholder="Search"
        backspaceRemovesValue={false}
        value={currency}
        components={{
          DropdownIndicator: (props) =>
            props.hasValue ? <components.DropdownIndicator {...props} /> : null,
          SingleValue: (props) => {
            const { getValue } = props;
            const [data] = getValue();

            if (data)
              return (
                <components.SingleValue {...props}>
                  <div className="flex gap-2">
                    <img src={data.image} className="h-auto w-4" />
                    <div className="uppercase text-[#282828]">
                      {data.ticker}
                    </div>
                  </div>
                </components.SingleValue>
              );
            return (
              <components.SingleValue {...props}>
                {props.children}
              </components.SingleValue>
            );
          },
          Control: (props) => {
            const { getValue, children } = props;
            const [value] = getValue();

            if (!value)
              return (
                <components.Control {...props}>
                  <div className="flex w-full" onClick={() => open(true)}>
                    {children}
                  </div>
                </components.Control>
              );

            return (
              <components.Control {...props}>
                <div className="flex w-full">
                  <div className="flex flex-1 py-2">
                    <Input
                      defaultValue={
                        currency?.amount ? currency.amount : undefined
                      }
                      onBlur={onAmountChange}
                    />
                  </div>
                  <div
                    className="flex w-[110px]"
                    onClick={() => open(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {children}
                  </div>
                </div>
              </components.Control>
            );
          },
          Option: (props) => {
            const { data, children, innerProps, ...otherProps } = props;
            const {
              // ignored props
              onMouseMove,
              onMouseOver,
              //
              ...otherInnerProps
            } = innerProps;
            const newProps = {
              innerProps: { ...otherInnerProps },
              data,
              ...otherProps,
            };
            return (
              <components.Option {...newProps}>
                <div className="flex gap-2">
                  <img src={data.image} className="h-auto w-4" loading="lazy" />
                  <div className="uppercase text-[#282828]">{data.ticker}</div>
                  <div className="truncate" title={data.name}>
                    {children}
                  </div>
                </div>
              </components.Option>
            );
          },
        }}
      />
    </div>
  );
};

const Input = React.memo(
  ({
    defaultValue,
    onBlur,
  }: {
    defaultValue?: number;
    onBlur: (value: number) => void;
  }) => (
    <input
      type="number"
      defaultValue={defaultValue}
      onBlur={(e) => {
        if (defaultValue !== Number(e.target.value))
          onBlur(Number(e.target.value));
      }}
      className={cx(
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        "h-full w-full border-r border-[#E3EBEF] pl-4",
        "bg-transparent text-base text-[#282828] outline outline-0"
      )}
    />
  )
);
