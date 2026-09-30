// Власник: TBD (див. docs/FRONTEND_TASKS.md)
// Підказка: використай proxyToBackend(req, шлях_на_бекенді) з lib/api/proxy.ts (приклад — app/api/auth/login/route.ts)
import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/categories');
}
