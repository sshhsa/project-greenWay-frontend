import { NextRequest } from 'next/server';

import { notImplemented } from '@/lib/api/proxy';

export async function GET(_req: NextRequest) {
  return notImplemented('GET /api/locations/popular');
}
