import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import packageJson from '../../../../package.json';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  checks: {
    database: 'connected' | 'error';
    environment: 'configured' | 'missing_vars';
  };
  uptime: number;
}

// Track server start time
const startTime = Date.now();

// GET /api/health - Health check endpoint
export async function GET() {
  const checks: HealthStatus['checks'] = {
    database: 'error',
    environment: 'missing_vars',
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'connected';
  } catch (error) {
    console.error('Health check: Database connection failed', error);
    checks.database = 'error';
  }

  // Check required environment variables
  const requiredEnvVars = [
    'POSTGRES_PRISMA_URL',
  ];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  checks.environment = missingVars.length === 0 ? 'configured' : 'missing_vars';

  // Determine overall status
  let status: HealthStatus['status'] = 'healthy';
  if (checks.database === 'error') {
    status = 'unhealthy';
  } else if (checks.environment === 'missing_vars') {
    status = 'degraded';
  }

  // Read version from package.json
  const version = packageJson.version;

  const health: HealthStatus = {
    status,
    version,
    timestamp: new Date().toISOString(),
    checks,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { status: httpStatus });
}
