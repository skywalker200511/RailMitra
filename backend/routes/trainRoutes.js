import { Router } from 'express';
import { validateTrainParams, validateTrainNumber } from '../middleware/validator.js';

/**
 * Creates direct railway data API routes (passthrough to provider).
 * These are optional debugging/direct-access endpoints.
 * The AI agent primarily uses internal tool functions.
 *
 * @param {import('../railway/railwayProvider.js').RailwayProvider} provider
 */
export function createTrainRoutes(provider) {
  const router = Router();

  /**
   * GET /api/trains/between/:from/:to
   * Search trains between two stations.
   * Query params: date (YYYY-MM-DD), type, category
   */
  router.get('/between/:from/:to', validateTrainParams, async (req, res, next) => {
    try {
      const { from, to } = req.params;
      const { date, type, category } = req.query;

      const result = await provider.searchTrains({ from, to, date, type, category });

      res.json({
        success: true,
        data: result,
        dataSource: provider.isLiveProvider() ? 'live' : 'mock',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/trains/:trainNumber/availability
   * Check seat availability for a train.
   * Query params: from, to, date, class, quota
   */
  router.get('/:trainNumber/availability', validateTrainNumber, async (req, res, next) => {
    try {
      const { trainNumber } = req.params;
      const { from, to, date, class: classType, quota } = req.query;

      if (!from || !to || !date || !classType) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMS',
            message: 'Required query parameters: from, to, date, class',
          },
        });
      }

      const result = await provider.getSeatAvailability({
        trainNumber,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date,
        classType: classType.toUpperCase(),
        quota: quota?.toUpperCase() || 'GN',
      });

      res.json({
        success: true,
        data: result,
        dataSource: provider.isLiveProvider() ? 'live' : 'mock',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/trains/:trainNumber/route
   * Get full route/schedule of a train.
   */
  router.get('/:trainNumber/route', validateTrainNumber, async (req, res, next) => {
    try {
      const { trainNumber } = req.params;
      const result = await provider.getTrainRoute({ trainNumber });

      res.json({
        success: true,
        data: result,
        dataSource: provider.isLiveProvider() ? 'live' : 'mock',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/trains/:trainNumber/status
   * Get live running status of a train.
   */
  router.get('/:trainNumber/status', validateTrainNumber, async (req, res, next) => {
    try {
      const { trainNumber } = req.params;
      const { date } = req.query;
      const result = await provider.getLiveStatus({ trainNumber, date });

      res.json({
        success: true,
        data: result,
        dataSource: provider.isLiveProvider() ? 'live' : 'mock',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/trains/:trainNumber/fare
   * Calculate fare for a train journey.
   * Query params: from, to, date, class, quota
   */
  router.get('/:trainNumber/fare', validateTrainNumber, async (req, res, next) => {
    try {
      const { trainNumber } = req.params;
      const { from, to, date, class: classType, quota } = req.query;

      if (!from || !to || !classType) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMS',
            message: 'Required query parameters: from, to, class',
          },
        });
      }

      const result = await provider.getFare({
        trainNumber,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        date,
        classType: classType.toUpperCase(),
        quota: quota?.toUpperCase() || 'GN',
      });

      res.json({
        success: true,
        data: result,
        dataSource: provider.isLiveProvider() ? 'live' : 'mock',
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
