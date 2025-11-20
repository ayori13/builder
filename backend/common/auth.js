import jwt from 'jsonwebtoken';
import { fail } from './response.js';
import { logger } from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return fail(res, 'NO_TOKEN', 'Токен отсутствует', 401);

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token)
    return fail(res, 'INVALID_AUTH', 'Некорректный токен', 401);

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    logger.warn({ err: e, requestId: req.requestId });
    return fail(res, 'INVALID_TOKEN', 'Ошибка проверки токена', 401);
  }
}
