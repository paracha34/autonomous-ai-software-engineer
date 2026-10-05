/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Early environment loading MUST execute before any other imports
import './src/utils/env.ts';
import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter, gitService, deploymentService } from './src/api/routes.ts';
import { logger } from './src/utils/logger.ts';
import { getRepositoryStatus } from './src/repository/repository.factory.ts';
import { getSandboxStatus } from './src/sandbox/sandbox.manager.ts';
import { generateComprehensiveHealthReport } from './src/utils/health.ts';
import { getDatabaseHealth, redactDatabaseUrl, isPlaceholderDatabaseUrl, checkDatabaseConnection } from './src/db/client.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // The dev server must listen on port 3000. (Nginx listens on 8080 and reverse proxies to 3000)
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Security: Payload size limiting
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Basic security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Comprehensive Health check endpoint with database, sandbox, git, and deployment status (Requirement 9)
  const healthHandler = async (_req: express.Request, res: express.Response) => {
    try {
      const report = await generateComprehensiveHealthReport(gitService, deploymentService);
      res.status(200).json(report);
    } catch (err: any) {
      res.status(500).json({
        status: 'degraded',
        error: err.message,
        productionReady: false,
      });
    }
  };

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  // Dedicated safe database health check endpoint (GET /api/health/db and /health/db)
  const dbHealthHandler = async (_req: express.Request, res: express.Response) => {
    try {
      const health = await getDatabaseHealth();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (err: any) {
      res.status(503).json({
        status: 'unhealthy',
        database: 'postgresql',
        schema: 'unreachable',
        error: 'Database health check failed',
      });
    }
  };

  app.get('/health/db', dbHealthHandler);
  app.get('/api/health/db', dbHealthHandler);

  if (!isProd) {
    // In development: mount Vite dev server middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    logger.info('project', 'Mounted Vite development middleware');
  } else {
    // In production: serve static build assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    logger.info('project', 'Mounted production static asset handlers');
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info('project', `AI Software Engineer server running at http://0.0.0.0:${PORT}`);

    // Startup database diagnostics without exposing credentials
    const rawDbUrl = process.env.DATABASE_URL;
    const isDbConfigured = !isPlaceholderDatabaseUrl(rawDbUrl);
    if (isDbConfigured) {
      logger.info('database', `Database configured: PostgreSQL (${redactDatabaseUrl(rawDbUrl)})`);
      checkDatabaseConnection()
        .then((status) => {
          if (status.connected) {
            logger.info(
              'database',
              `PostgreSQL connected to [${status.databaseName || 'postgres'}]. Tables: ${status.tableCount ?? 'unknown'}, Latency: ${status.latencyMs}ms, Production ready: ${status.productionReady}`
            );
          } else {
            logger.warn('database', `PostgreSQL connection check failed: ${status.error || 'Unknown error'}`);
            if (isProd) {
              logger.error('database', 'CRITICAL: Production server requires active database connectivity.');
            }
          }
        })
        .catch((err) => {
          logger.warn('database', `Database diagnostic check failed: ${err.message}`);
        });
    } else {
      logger.info(
        'database',
        isProd
          ? 'DATABASE_CONFIGURATION_WARNING: DATABASE_URL is not set for production environment.'
          : 'Database: Unset or placeholder DATABASE_URL. In-memory development repository active.'
      );
    }
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
