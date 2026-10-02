import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/locations');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/locations');
}
