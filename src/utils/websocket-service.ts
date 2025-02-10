type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private subscribers: Map<string, Set<WebSocketCallback>> = new Map();
  private isConnecting = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private async connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          this.notifySubscribers(type, data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        this.isConnecting = false;
        if (!event.wasClean) {
          console.log('WebSocket connection closed unexpectedly');
          this.attemptReconnect();
        }
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to establish WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(type: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);

    // If connection is closed, try to reconnect
    if (this.ws?.readyState === WebSocket.CLOSED) {
      this.connect();
    }

    return () => {
      this.subscribers.get(type)?.delete(callback);
      if (this.subscribers.get(type)?.size === 0) {
        this.subscribers.delete(type);
      }
    };
  }

  private notifySubscribers(type: string, data: any) {
    this.subscribers.get(type)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }
}

export const wsService = new WebSocketService(); 