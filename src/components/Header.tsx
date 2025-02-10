'use client';

import { useState, useEffect } from 'react';
import { CreateDropdown } from '@/components/ui/CreateDropdown';
import { CreateRoomModal } from './rooms/CreateRoomModal';
import { TokenGeneratorModal } from './rooms/TokenGeneratorModal';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  // Debug log
  useEffect(() => {
    console.log('Auth state:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-surface-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-50 rounded-xl">
                <VideoCameraIcon className="h-7 w-7 text-brand-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-surface-900">LiveKit Dashboard</h1>
                <p className="text-sm text-surface-500">Server Management</p>
              </div>
            </div>
            {/* Debug render */}
            <div className="flex items-center space-x-4">
              {isAuthenticated === null && <span>Loading...</span>}
              {isAuthenticated && (
                <>
                  <CreateDropdown
                    onCreateRoom={() => setIsCreateModalOpen(true)}
                    onGenerateToken={() => setIsTokenModalOpen(true)}
                  />
                  <button
                    onClick={signOut}
                    className="text-surface-500 hover:text-surface-700 text-sm font-medium transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <>
          <CreateRoomModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={async (data) => {
              const toastId = (window as any).toast.show('Creating room...', 'loading');
              try {
                await fetch('/api/rooms', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                (window as any).toast.update(toastId, 'Room created successfully', 'success');
                setIsCreateModalOpen(false);
              } catch (error) {
                console.error('Failed to create room:', error);
                (window as any).toast.update(toastId, 'Failed to create room', 'error');
                throw error;
              }
            }}
          />

          <TokenGeneratorModal
            isOpen={isTokenModalOpen}
            onClose={() => setIsTokenModalOpen(false)}
            roomId=""
            roomName="New Token"
          />
        </>
      )}
    </>
  );
} 