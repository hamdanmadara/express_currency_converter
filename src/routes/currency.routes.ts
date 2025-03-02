import { Router } from 'express';
import { currencyController } from '../controllers/currency.controller';

const router = Router();

/**
 * @route   GET /api/currencies
 * @desc    Get all available currencies
 * @access  Public
 */
router.get('/currencies', currencyController.getCurrencies.bind(currencyController));

/**
 * @route   GET /api/rates
 * @desc    Get exchange rates for a base currency
 * @access  Public
 */
router.get('/rates', currencyController.getExchangeRates.bind(currencyController));

/**
 * @route   POST /api/convert
 * @desc    Convert an amount from one currency to another
 * @access  Public
 */
router.post('/convert', currencyController.convertCurrency.bind(currencyController));

export const currencyRoutes = router;