import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  currencyApi: {
    key: process.env.CURRENCY_API_KEY || '',
    baseUrl: process.env.CURRENCY_API_BASE_URL || 'https://api.freecurrencyapi.com/v1',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
};

// Validate that required environment variables are present
const validateConfig = (): void => {
  if (!config.currencyApi.key) {
    throw new Error('CURRENCY_API_KEY is not defined in environment variables');
  }
};

export { config, validateConfig };