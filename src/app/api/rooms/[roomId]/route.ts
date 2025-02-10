import { RoomServiceClient } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';
import { roomService } from '@/utils/livekit-service';

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!livekitHost || !apiKey || !apiSecret) {
  throw new Error('LiveKit credentials not properly configured');
}

const roomServiceSDK = new RoomServiceClient(livekitHost, apiKey, apiSecret);

export async function DELETE(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    await roomServiceSDK.deleteRoom(params.roomId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete room:', error);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const data = await request.json();
    await roomService.updateRoomMetadata(params.roomId, JSON.stringify(data));
    const room = await roomService.getRoom(params.roomId);
    return NextResponse.json(room);
  } catch (error) {
    console.error('Failed to update room:', error);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
} 