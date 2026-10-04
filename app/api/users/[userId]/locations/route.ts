import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

type Ctx = { params: Promise<{ userId: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { userId } = await ctx.params;
  return proxyToBackend(req, `/users/${userId}/locations`);
}
