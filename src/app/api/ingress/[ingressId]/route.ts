import { NextResponse } from 'next/server';
import { ingressClient } from '@/utils/livekit-service';

export async function PATCH(
  request: Request,
  { params }: { params: { ingressId: string } }
) {
  try {
    const data = await request.json();
    const ingress = await ingressClient.updateIngress({
      ingressId: params.ingressId,
      ...data
    });
    return NextResponse.json(ingress);
  } catch (error) {
    console.error('Failed to update ingress:', error);
    return NextResponse.json({ error: 'Failed to update ingress' }, { status: 500 });
  }
} 