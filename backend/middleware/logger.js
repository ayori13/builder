const crypto = require("crypto");
const pino = require("pino");

// Простой logger (совместим с Jest)
const logger = pino({
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime
});

function requestLogger(req, res, next) {
  const id = req.headers["x-request-id"] || crypto.randomUUID();
  req.id = id;
  req.logger = logger.child({ requestId: id });

  res.setHeader("x-request-id", id);

  req.logger.info({
    msg: "Incoming request",
    method: req.method,
    url: req.url
  });

  const start = Date.now();
  res.on("finish", () => {
    req.logger.info({
      msg: "Response sent",
      status: res.statusCode,
      duration: Date.now() - start
    });
  });

  next();
}

module.exports = { requestLogger, logger };
