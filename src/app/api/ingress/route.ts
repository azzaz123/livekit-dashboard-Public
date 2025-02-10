import { IngressClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!livekitHost || !apiKey || !apiSecret) {
  throw new Error('LiveKit credentials not properly configured');
}

const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);

export async function GET() {
  try {
    const ingresses = await ingressClient.listIngress();
    return NextResponse.json(ingresses);
  } catch (error) {
    console.error('Failed to fetch ingress:', error);
    return NextResponse.json({ error: 'Failed to fetch ingress' }, { status: 500 });
  }
} 