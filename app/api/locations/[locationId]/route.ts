import { NextRequest } from 'next/server';

import { notImplemented } from '@/lib/api/proxy';

type Ctx = { params: Promise<{ locationId: string }> };

export async function GET(_req: NextRequest, _ctx: Ctx) {
  return notImplemented('GET /api/locations/:locationId');
}

export async function PATCH(_req: NextRequest, _ctx: Ctx) {
  return notImplemented('PATCH /api/locations/:locationId');
}
