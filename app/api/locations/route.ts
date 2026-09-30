// Підказка: використай proxyToBackend(req, шлях_на_бекенді) з lib/api/proxy.ts (приклад — app/api/auth/login/route.ts)
// (!) У файлі дві функції з різними власниками — кожен змінює ТІЛЬКИ свою.
import { NextRequest } from 'next/server';

import { notImplemented, proxyToBackend } from '@/lib/api/proxy';

// Власник: TBD (див. docs/FRONTEND_TASKS.md)
export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/locations');
}

// Власник: TBD (див. docs/FRONTEND_TASKS.md)
export async function POST(_req: NextRequest) {
  return notImplemented('POST /api/locations');
}
