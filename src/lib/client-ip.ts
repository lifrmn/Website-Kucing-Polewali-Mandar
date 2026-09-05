interface RequestWithHeaders {
  headers: Pick<Headers, 'get'>;
}

export function getClientIp(request: RequestWithHeaders): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwarded || request.headers.get('x-real-ip')?.trim();

  if (!address || address.length > 64 || !/^[a-fA-F0-9:.]+$/.test(address)) {
    return 'unknown';
  }
  return address;
}