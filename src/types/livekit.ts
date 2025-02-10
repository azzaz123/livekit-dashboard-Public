export interface IngressState {
  status: string;
  error: string;
  roomId: string;
  tracks: any[];
  startedAt: string;
  endedAt: string;
  resourceId: string;
  updatedAt: string;
  video?: {
    mimeType: string;
    averageBitrate: number;
    width: number;
    height: number;
    framerate: number;
  };
  audio?: {
    mimeType: string;
    averageBitrate: number;
    channels: number;
    sampleRate: number;
  };
}

export interface IngressInfo {
  ingressId: string;
  name: string;
  streamKey: string;
  url: string;
  state: string | IngressState;
}

export interface EgressInfo {
  egressId: string;
  roomId: string;
  roomName: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  error?: string;
  outputType: string;
  fileOutput?: {
    filepath: string;
    filename: string;
    s3?: {
      bucket: string;
      key: string;
      region: string;
    };
  };
} 