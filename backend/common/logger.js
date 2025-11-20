import pino from 'pino';

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

export function logRequest(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      user: req.user?.id || null,
      status: res.statusCode,
      duration: Date.now() - start
    });
  });

  next();
}
