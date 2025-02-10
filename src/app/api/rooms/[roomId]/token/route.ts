import { NextResponse } from 'next/server';
import { AccessToken, VideoGrant } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error('LiveKit credentials not properly configured');
}

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { participantName, canPublish = true, canSubscribe = true } = await request.json();

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    });

    const grant: VideoGrant = {
      room: params.roomId,
      roomJoin: true,
      canPublish,
      canSubscribe,
    };

    at.addGrant(grant);
    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Failed to generate token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
} 