import { IngressClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!livekitHost || !apiKey || !apiSecret) {
  throw new Error('LiveKit credentials not properly configured');
}

const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);

export async function POST(
  request: Request,
  { params }: { params: { ingressId: string } }
) {
  try {
    await ingressClient.stopIngress(params.ingressId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to stop ingress:', error);
    return NextResponse.json({ error: 'Failed to stop ingress' }, { status: 500 });
  }
} 