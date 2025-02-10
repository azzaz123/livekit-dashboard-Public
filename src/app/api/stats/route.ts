import { NextResponse } from 'next/server';
import { getLiveKitStats } from '@/utils/livekit-service';

export async function GET() {
  try {
    const stats = await getLiveKitStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
} 