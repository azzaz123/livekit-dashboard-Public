import { NextResponse } from 'next/server';
import { roomService } from '@/utils/livekit-service';

export async function GET() {
  try {
    const rooms = await roomService.listRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const room = await roomService.createRoom(data);
    return NextResponse.json(room);
  } catch (error) {
    console.error('Failed to create room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
} 