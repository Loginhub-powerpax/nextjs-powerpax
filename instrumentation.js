/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts. We use it to schedule a recurring
 * self-ping so the hosting platform never puts the process to sleep,
 * which would cause "This page couldn't load" errors on first visit.
 */
export async function register() {
  // Only run in Node.js runtime (not Edge), and only in production.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const PING_INTERVAL_MS = 4 * 60 * 1000; // ping every 4 minutes

    // Determine base URL: use env var first, fall back to localhost
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null ||
      'http://localhost:3000';

    const pingUrl = `${baseUrl}/api/ping`;

    const ping = async () => {
      try {
        await fetch(pingUrl, { cache: 'no-store' });
        console.log(`[keepalive] pinged ${pingUrl}`);
      } catch (err) {
        // Non-fatal — server may still be starting up
        console.warn(`[keepalive] ping failed:`, err?.message);
      }
    };

    // Initial ping after 5 seconds (let the server finish booting)
    setTimeout(ping, 5000);

    // Recurring ping
    setInterval(ping, PING_INTERVAL_MS);
  }
}
