import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

// EXTRA: GET /api/geocode/search → бекенд /geocode/search (query прокидається як є)
export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/geocode/search');
}
