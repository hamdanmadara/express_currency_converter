import { ConversionResult } from '../types';

// Since we're using local storage in the frontend for persistence,
// this model is primarily for type definition and potential future database integration

export class CurrencyConversion implements ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;

  constructor(conversion: ConversionResult) {
    this.from = conversion.from;
    this.to = conversion.to;
    this.amount = conversion.amount;
    this.result = conversion.result;
    this.rate = conversion.rate;
    this.timestamp = conversion.timestamp || Date.now();
  }

  // Format for API response
  toJSON(): ConversionResult {
    return {
      from: this.from,
      to: this.to,
      amount: this.amount,
      result: this.result,
      rate: this.rate,
      timestamp: this.timestamp
    };
  }
}