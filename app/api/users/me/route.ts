import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/users/me');
}

export async function PATCH(req: NextRequest) {
  return proxyToBackend(req, '/users/me');
}
