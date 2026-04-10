import { NextResponse } from 'next/server';

/**
 * Lightweight health-check / keepalive endpoint.
 * Called by the self-ping in instrumentation.js to prevent cold-starts.
 * Also used by the login page to warm up the server before the first request.
 */
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
