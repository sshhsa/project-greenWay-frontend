import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function proxyToBackend(
  req: NextRequest,
  path: string,
): Promise<NextResponse> {
  const url = new URL(`${BACKEND_API_URL}${path}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const headers = new Headers();
  const cookie = req.headers.get('cookie');
  const contentType = req.headers.get('content-type');
  if (cookie) headers.set('cookie', cookie);
  if (contentType) headers.set('content-type', contentType);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      cache: 'no-store',
    });

    const body = res.status === 204 ? null : await res.text();
    const response = new NextResponse(body, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
    for (const setCookie of res.headers.getSetCookie()) {
      response.headers.append('set-cookie', setCookie);
    }
    return response;
  } catch {
    return NextResponse.json(
      { status: 502, message: 'Backend is unavailable' },
      { status: 502 },
    );
  }
}

export function notImplemented(route: string): NextResponse {
  return NextResponse.json(
    { status: 501, message: `Not implemented: ${route}` },
    { status: 501 },
  );
}
