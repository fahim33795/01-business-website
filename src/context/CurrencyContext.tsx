import React, { createContext, useContext } from 'react';

export type Currency = 'BDT';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  usdToBdtRate: number;
  formatPrice: (amount: number) => string;
  rawPrice: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency: Currency = 'BDT';
  const usdToBdtRate = 120;

  const setCurrency = () => {};

  const rawPrice = (amount: number): number => {
    if (!amount) return 0;
    return Math.round(amount);
  };

  const formatPrice = (amount: number): string => {
    const bdt = rawPrice(amount);
    return `৳${bdt.toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, usdToBdtRate, formatPrice, rawPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
