import { NextResponse } from 'next/server';
import { egressClient } from '@/utils/livekit-service';

export async function GET() {
  try {
    const egresses = await egressClient.listEgress();
    return NextResponse.json(egresses);
  } catch (error) {
    console.error('Failed to fetch egresses:', error);
    return NextResponse.json({ error: 'Failed to fetch egresses' }, { status: 500 });
  }
} 