const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const DEFAULT_BODY_LIMIT_BYTES = 100 * 1024;
const UPLOAD_BODY_LIMIT_BYTES = 6 * 1024 * 1024;
const UPLOAD_REQUESTS = new Set([
  'POST /api/upload',
  'PUT /api/orders/customer',
  'PUT /api/bookings/customer',
]);

export function isTrustedMutationRequest(request: Request): boolean {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return true;
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;

  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function getRequestBodyLimit(request: Request): number | null {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return null;

  const pathname = new URL(request.url).pathname;
  const requestKey = `${request.method.toUpperCase()} ${pathname}`;
  return UPLOAD_REQUESTS.has(requestKey)
    ? UPLOAD_BODY_LIMIT_BYTES
    : DEFAULT_BODY_LIMIT_BYTES;
}

export async function isRequestBodyWithinLimit(request: Request): Promise<boolean> {
  const limit = getRequestBodyLimit(request);
  if (limit === null) return true;

  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    return Number.isSafeInteger(declaredLength) && declaredLength >= 0 && declaredLength <= limit;
  }

  const body = await request.clone().arrayBuffer();
  return body.byteLength <= limit;
}