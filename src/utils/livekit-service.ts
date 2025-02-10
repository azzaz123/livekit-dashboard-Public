import { 
  RoomServiceClient, 
  IngressClient, 
  EgressClient,
  Room,
  IngressInfo,
  EgressInfo
} from 'livekit-server-sdk';

if (!process.env.LIVEKIT_HOST || !process.env.LIVEKIT_KEY || !process.env.LIVEKIT_SECRET) {
  throw new Error('LiveKit credentials not properly configured');
}

const livekitHost = process.env.LIVEKIT_HOST;
const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

export const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);
export const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);
export const egressClient = new EgressClient(livekitHost, apiKey, apiSecret);

export interface LiveKitStats {
  activeRooms: number;
  activeStreams: number;
  participants: number;
  bandwidth: number;
}

export async function getLiveKitStats(): Promise<LiveKitStats> {
  const [rooms, ingresses, egresses] = await Promise.all([
    roomService.listRooms(),
    ingressClient.listIngress(),
    egressClient.listEgress()
  ]);

  const activeIngresses = ingresses.filter(ingress => 
    typeof ingress.state === 'string' 
      ? JSON.parse(ingress.state).status === 'ENDPOINT_ACTIVE'
      : ingress.state?.status === 'ENDPOINT_ACTIVE'
  );

  const activeEgresses = egresses.filter(egress => 
    egress.status === 'EGRESS_ACTIVE'
  );

  const totalParticipants = rooms.reduce((acc, room) => acc + room.numParticipants, 0);

  return {
    activeRooms: rooms.length,
    activeStreams: activeIngresses.length + activeEgresses.length,
    participants: totalParticipants,
    bandwidth: calculateBandwidth(rooms, ingresses, egresses)
  };
}

function calculateBandwidth(rooms: Room[], ingresses: IngressInfo[], egresses: EgressInfo[]): number {
  // This is a placeholder - implement actual bandwidth calculation based on your needs
  const ingressBandwidth = ingresses.reduce((acc, ingress) => {
    const state = typeof ingress.state === 'string' ? JSON.parse(ingress.state) : ingress.state;
    return acc + (state?.video?.averageBitrate || 0);
  }, 0);

  // Convert to GB/s
  return Number((ingressBandwidth / (1024 * 1024 * 1024)).toFixed(2));
} 