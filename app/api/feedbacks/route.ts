import { NextRequest } from 'next/server';
import { notImplemented, proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/feedbacks');
}

export async function POST(_req: NextRequest) {
  return notImplemented('POST /api/feedbacks');
}
