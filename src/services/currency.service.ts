import axios from 'axios';
import { config } from '../config/config';
import { 
  CurrencyResponse, 
  ConversionRateResponse, 
  ConversionRequest, 
  ConversionResult,
  ApiError
} from '../types';

export class CurrencyService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.currencyApi.baseUrl;
    this.apiKey = config.currencyApi.key;
  }

  /**
   * Get all supported currencies
   */
  async getCurrencies(): Promise<CurrencyResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/currencies`, {
        headers: {
          'apikey': this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Get latest exchange rates
   * @param baseCurrency Base currency code
   * @param targetCurrencies Target currency codes (comma-separated)
   */
  async getExchangeRates(baseCurrency: string, targetCurrencies?: string): Promise<ConversionRateResponse> {
    try {
      const params: Record<string, string> = {
        base_currency: baseCurrency
      };
      
      if (targetCurrencies) {
        params.currencies = targetCurrencies;
      }

      const response = await axios.get(`${this.baseUrl}/latest`, {
        headers: {
          'apikey': this.apiKey
        },
        params
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Convert amount from one currency to another
   * @param conversionRequest Conversion request details
   */
  async convertCurrency(conversionRequest: ConversionRequest): Promise<ConversionResult> {
    const { from, to, amount } = conversionRequest;
    
    try {
      const ratesResponse = await this.getExchangeRates(from, to);
      const rate = ratesResponse.data[to];
      
      if (!rate) {
        const error: ApiError = new Error('Exchange rate not available for the requested currency pair') as ApiError;
        error.statusCode = 404;
        throw error;
      }
      
      const result = amount * rate;
      
      return {
        from,
        to,
        amount,
        result,
        rate,
        timestamp: Date.now()
      };
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors and transform them into a consistent format
   * @param error Error object from axios
   */
  private handleApiError(error: any): never {
    const apiError: ApiError = new Error(
      error.response?.data?.message || error.message || 'Currency API error'
    ) as ApiError;
    
    apiError.statusCode = error.response?.status || 500;
    apiError.details = error.response?.data || {};
    
    throw apiError;
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();