import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdmin } from '@/lib/authorization';
import prisma from '@/lib/prisma';
import {
  getDashboardData,
  getReportData,
  REPORT_PERIODS,
  type ReportPeriod,
} from '@/services/dashboardService';

export async function GET(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('orders:read');
    if (!authorization.authorized) return authorization.response;

    const { searchParams } = new URL(request.url);
    if (searchParams.get('report') === 'true') {
      const period = Number(searchParams.get('period') || 30);
      if (!REPORT_PERIODS.includes(period as ReportPeriod)) {
        return NextResponse.json(
          { success: false, error: 'Periode laporan tidak valid' },
          { status: 422 }
        );
      }
      const data = await getReportData(prisma, period as ReportPeriod);
      return NextResponse.json({ success: true, data });
    }

    const data = await getDashboardData(prisma);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error('GET dashboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik dashboard' },
      { status: 500 }
    );
  }
}
