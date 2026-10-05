import { NextRequest, NextResponse } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

const SESSION_COOKIES = ['accessToken', 'refreshToken', 'sessionId'];

// GET /api/users/me: гість (без cookies) або невалідна сесія → 200 { data: null }, а не 401.
// Так у консолі немає червоної помилки для незалогіненого користувача,
// а протухлі cookies видаляються, щоб middleware більше не пускав на приватні сторінки.
export async function GET(req: NextRequest) {
  const hasSession =
    req.cookies.has('accessToken') || req.cookies.has('refreshToken');
  if (!hasSession) return NextResponse.json({ data: null });

  const response = await proxyToBackend(req, '/users/me');
  if (response.status !== 401) return response;

  const guest = NextResponse.json({ data: null });
  SESSION_COOKIES.forEach((name) => guest.cookies.delete(name));
  return guest;
}

export async function PATCH(req: NextRequest) {
  return proxyToBackend(req, '/users/me');
}
