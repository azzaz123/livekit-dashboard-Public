'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';

interface TokenGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
}

export function TokenGeneratorModal({ isOpen, onClose, roomId, roomName }: TokenGeneratorModalProps) {
  const [participantName, setParticipantName] = useState('');
  const [canPublish, setCanPublish] = useState(true);
  const [canSubscribe, setCanSubscribe] = useState(true);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/rooms/${roomId}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName,
          canPublish,
          canSubscribe,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setToken(data.token);
    } catch (error) {
      console.error('Failed to generate token:', error);
      (window as any).toast.show('Failed to generate token', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    (window as any).toast.show('Token copied to clipboard', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Generate Token for ${roomName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Participant Name
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder="Enter participant name"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="canPublish"
              checked={canPublish}
              onChange={(e) => setCanPublish(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="canPublish" className="ml-2 block text-sm text-gray-900">
              Can Publish
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="canSubscribe"
              checked={canSubscribe}
              onChange={(e) => setCanSubscribe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="canSubscribe" className="ml-2 block text-sm text-gray-900">
              Can Subscribe
            </label>
          </div>
        </div>

        {!token ? (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Token'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Generated Token
              </label>
              <textarea
                value={token}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
            <button
              type="button"
              onClick={copyToken}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Copy Token
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
} 