import { NextResponse } from 'next/server';
import { egressClient } from '@/utils/livekit-service';

export async function PATCH(
  request: Request,
  { params }: { params: { egressId: string } }
) {
  try {
    const data = await request.json();
    const egress = await egressClient.updateEgress({
      egressId: params.egressId,
      ...data
    });
    return NextResponse.json(egress);
  } catch (error) {
    console.error('Failed to update egress:', error);
    return NextResponse.json({ error: 'Failed to update egress' }, { status: 500 });
  }
} 