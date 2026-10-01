import { NextRequest } from 'next/server';

import { notImplemented, proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/locations');
}

export async function POST(_req: NextRequest) {
  return notImplemented('POST /api/locations');
}
