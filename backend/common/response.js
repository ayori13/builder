export function ok(res, data = null) {
  return res.json({ success: true, data });
}

export function fail(res, code = 'BAD_REQUEST', message = 'Ошибка', status = 400) {
  return res.status(status).json({
    success: false,
    error: { code, message }
  });
}
