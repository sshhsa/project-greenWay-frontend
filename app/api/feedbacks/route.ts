import { NextRequest } from 'next/server';

import { notImplemented } from '@/lib/api/proxy';

export async function GET(_req: NextRequest) {
  return notImplemented('GET /api/feedbacks');
}

export async function POST(_req: NextRequest) {
  return notImplemented('POST /api/feedbacks');
}
