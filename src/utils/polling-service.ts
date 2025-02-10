import { LiveKitStats } from '@/utils/livekit-service';

type PollingCallback<T> = (data: T) => void;

class PollingService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private pollingInterval = 5000; // 5 seconds

  async fetchData(endpoint: string) {
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  subscribe<T>(endpoint: string, callback: PollingCallback<T>) {
    // Initial fetch
    this.fetchData(endpoint).then(callback).catch(console.error);

    // Set up polling
    const interval = setInterval(async () => {
      try {
        const data = await this.fetchData(endpoint);
        callback(data);
      } catch (error) {
        console.error(`Polling error for ${endpoint}:`, error);
      }
    }, this.pollingInterval);

    this.intervals.set(endpoint, interval);

    // Return cleanup function
    return () => {
      const interval = this.intervals.get(endpoint);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(endpoint);
      }
    };
  }
}

export const pollingService = new PollingService(); 