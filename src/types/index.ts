// Currency types
export interface Currency {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
  }
  
  export interface CurrencyResponse {
    data: Record<string, Currency>;
  }
  
  // Conversion types
  export interface ConversionRequest {
    from: string;
    to: string;
    amount: number;
  }
  
  export interface ConversionRate {
    base_code: string;
    rates: Record<string, number>;
  }
  
  export interface ConversionRateResponse {
    data: Record<string, number>;
  }
  
  export interface ConversionResult {
    from: string;
    to: string;
    amount: number;
    result: number;
    rate: number;
    timestamp: number;
  }
  
  // Error interface
  export interface ApiError extends Error {
    statusCode: number;
    details?: any;
  }