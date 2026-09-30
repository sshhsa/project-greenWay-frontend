import { NextRequest } from 'next/server';

import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/users/me');
}

// Власник: Маркіян — редагування профілю (ім'я + аватар, multipart/form-data)
export async function PATCH(req: NextRequest) {
  return proxyToBackend(req, '/users/me');
}
