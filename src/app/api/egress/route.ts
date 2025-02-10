import { EgressClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!livekitHost || !apiKey || !apiSecret) {
  throw new Error('LiveKit credentials not properly configured');
}

const egressClient = new EgressClient(livekitHost, apiKey, apiSecret);

export async function GET() {
  try {
    const egresses = await egressClient.listEgress();
    return NextResponse.json(egresses);
  } catch (error) {
    console.error('Failed to fetch egress:', error);
    return NextResponse.json({ error: 'Failed to fetch egress' }, { status: 500 });
  }
} 