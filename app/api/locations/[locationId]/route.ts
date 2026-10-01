import { NextRequest } from 'next/server';

import { notImplemented, proxyToBackend } from '@/lib/api/proxy';

type Ctx = { params: Promise<{ locationId: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { locationId } = await ctx.params;
  return proxyToBackend(req, `/locations/${locationId}`);
}

export async function PATCH(_req: NextRequest, _ctx: Ctx) {
  return notImplemented('PATCH /api/locations/:locationId');
}