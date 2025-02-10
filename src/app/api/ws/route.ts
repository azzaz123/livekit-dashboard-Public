import { WebSocketServer } from 'ws';
import { getLiveKitStats } from '@/utils/livekit-service';
import { roomService, ingressClient, egressClient } from '@/utils/livekit-service';

let wss: WebSocketServer;

// Initialize WebSocket server
if (!(global as any).wss) {
  (global as any).wss = new WebSocketServer({ noServer: true });
  wss = (global as any).wss;
} else {
  wss = (global as any).wss;
}

export async function GET(req: Request) {
  try {
    const { socket, response } = await (req as any).socket.server.upgrade(req);
    
    // Handle connection
    const handleConnection = async () => {
      try {
        // Send initial data
        const stats = await getLiveKitStats();
        const rooms = await roomService.listRooms();
        const ingresses = await ingressClient.listIngress();
        const egresses = await egressClient.listEgress();

        socket.send(JSON.stringify({ type: 'stats', data: stats }));
        socket.send(JSON.stringify({ type: 'rooms', data: rooms }));
        socket.send(JSON.stringify({ type: 'ingresses', data: ingresses }));
        socket.send(JSON.stringify({ type: 'egresses', data: egresses }));

        // Set up polling for updates
        const interval = setInterval(async () => {
          try {
            if (socket.readyState === socket.OPEN) {
              const [stats, rooms, ingresses, egresses] = await Promise.all([
                getLiveKitStats(),
                roomService.listRooms(),
                ingressClient.listIngress(),
                egressClient.listEgress()
              ]);

              socket.send(JSON.stringify({ type: 'stats', data: stats }));
              socket.send(JSON.stringify({ type: 'rooms', data: rooms }));
              socket.send(JSON.stringify({ type: 'ingresses', data: ingresses }));
              socket.send(JSON.stringify({ type: 'egresses', data: egresses }));
            }
          } catch (error) {
            console.error('Error fetching updates:', error);
          }
        }, 5000);

        socket.on('close', () => {
          clearInterval(interval);
        });
      } catch (error) {
        console.error('Error in WebSocket connection:', error);
      }
    };

    wss.handleUpgrade(req, socket, Buffer.from(''), handleConnection);
    return response;
  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
} 