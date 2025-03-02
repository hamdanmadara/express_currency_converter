import { Request, Response, NextFunction } from 'express';
import { currencyService } from '../services/currency.service';
import { ConversionRequest, ApiError } from '../types';
import { CurrencyConversion } from '../models/currency.model';

export class CurrencyController {
  /**
   * Get all available currencies
   */
  async getCurrencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currencies = await currencyService.getCurrencies();
      res.status(200).json(currencies);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get exchange rates for a base currency
   */
  async getExchangeRates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { base, currencies } = req.query;

      if (!base || typeof base !== 'string') {
        const error: ApiError = new Error('Base currency is required') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const targetCurrencies = currencies as string;
      const rates = await currencyService.getExchangeRates(base, targetCurrencies);
      res.status(200).json(rates);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Convert an amount from one currency to another
   */
  async convertCurrency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to, amount } = req.body as ConversionRequest;

      // Validate inputs
      if (!from || !to || amount === undefined) {
        const error: ApiError = new Error('Invalid request. "from", "to" and "amount" are required.') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      if (isNaN(amount) || amount <= 0) {
        const error: ApiError = new Error('Amount must be a positive number') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const conversionResult = await currencyService.convertCurrency({ from, to, amount });
      const conversion = new CurrencyConversion(conversionResult);
      
      res.status(200).json(conversion);
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const currencyController = new CurrencyController();