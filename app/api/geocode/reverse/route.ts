import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

// EXTRA: GET /api/geocode/reverse → бекенд /geocode/reverse (query прокидається як є)
export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/geocode/reverse');
}
