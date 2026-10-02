import { NextRequest } from 'next/server';

import { notImplemented } from '@/lib/api/proxy';

type Ctx = { params: Promise<{ userId: string }> };

export async function GET(_req: NextRequest, _ctx: Ctx) {
  return notImplemented('GET /api/users/:userId/locations');
}
