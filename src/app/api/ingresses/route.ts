import { NextResponse } from 'next/server';
import { ingressClient } from '@/utils/livekit-service';

export async function GET() {
  try {
    const ingresses = await ingressClient.listIngress();
    return NextResponse.json(ingresses);
  } catch (error) {
    console.error('Failed to fetch ingresses:', error);
    return NextResponse.json({ error: 'Failed to fetch ingresses' }, { status: 500 });
  }
} 