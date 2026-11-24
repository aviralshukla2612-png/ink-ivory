import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const dbCheckStart = Date.now();
    if (typeof (store as any).init === 'function') {
      await (store as any).init();
    }
    // Perform a lightweight probe on the store
    await store.getCoupons();
    dbLatencyMs = Date.now() - dbCheckStart;
  } catch (error: any) {
    dbStatus = 'degraded';
    console.error('[HealthCheck] Database probe failed:', error?.message || error);
  }

  const memoryUsage = process.memoryUsage();

  const healthPayload = {
    status: dbStatus === 'healthy' ? 'ok' : 'degraded',
    service: 'you-are-mine-api',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    components: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
    },
  };

  const statusCode = dbStatus === 'healthy' ? 200 : 503;
  return NextResponse.json(healthPayload, { status: statusCode });
}
