import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { authOptions } from './auth-options';

// NextAuth v4 con App Router: usar NextRequest y RouteHandlerContext
// En Next.js 15, params es una Promise
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  // NextAuth v4 puede ser llamado con (req, res, options) para App Router
  return (NextAuth as any)(request, { params }, authOptions);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  // NextAuth v4 puede ser llamado con (req, res, options) para App Router
  return (NextAuth as any)(request, { params }, authOptions);
}
