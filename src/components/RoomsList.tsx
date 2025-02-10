'use client';

import { useEffect, useState } from 'react';
import { UsersIcon, VideoCameraIcon, ClockIcon, XCircleIcon, PencilIcon, PlusIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import Modal from '@/components/ui/Modal';
import CodeBlock from '@/components/ui/CodeBlock';
import { pollingService } from '@/utils/polling-service';
import { EditableField } from '@/components/ui/EditableField';
import { UpdateRoomModal } from '@/components/rooms/UpdateRoomModal';
import { CreateRoomModal } from './rooms/CreateRoomModal';
import { TokenGeneratorModal } from './rooms/TokenGeneratorModal';

interface Room {
  sid: string;
  name: string;
  numParticipants: number;
  creationTime: number;
  metadata?: string;
  activeRecording: boolean;
  participants?: Participant[];
}

interface Participant {
  identity: string;
  name?: string;
  joinedAt: number;
  isPublisher: boolean;
  tracks: Track[];
}

interface Track {
  sid: string;
  type: string;
  name: string;
  muted: boolean;
}

export default function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'participants'>('info');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState<Room | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    return pollingService.subscribe('rooms', (data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  async function handleParticipantAction(roomId: string, participantId: string, action: 'mute' | 'remove') {
    try {
      await fetch(`/api/rooms/${roomId}/participants/${participantId}/${action}`, {
        method: 'POST'
      });
      // Refresh room data
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error(`Failed to ${action} participant:`, error);
    }
  }

  async function handleDeleteRoom(roomId: string) {
    if (!confirm('Are you sure you want to delete this room? All participants will be disconnected.')) {
      return;
    }

    const toastId = (window as any).toast.show('Deleting room...', 'loading');

    try {
      await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });
      
      // Refresh the list
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
      
      (window as any).toast.update(toastId, 'Room deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete room:', error);
      (window as any).toast.update(toastId, 'Failed to delete room', 'error');
    }
  }

  const handleEdit = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setRoomToUpdate(room);
    setIsUpdateModalOpen(true);
  };

  async function handleCreateRoom(data: any) {
    const toastId = (window as any).toast.show('Creating room...', 'loading');
    
    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      (window as any).toast.update(toastId, 'Room created successfully', 'success');
    } catch (error) {
      console.error('Failed to create room:', error);
      (window as any).toast.update(toastId, 'Failed to create room', 'error');
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Active Rooms</h2>
              <p className="text-sm text-gray-500 mt-1">Currently active LiveKit rooms</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {rooms.length} Total
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {rooms.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No active rooms</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new room.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div 
                key={room.sid} 
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{room.name}</h3>
                      {room.activeRecording && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Recording
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">ID: {room.sid}</p>
                  </div>
                  <div className="ml-6 flex items-center space-x-2">
                    <button
                      onClick={(e) => handleEdit(e, room)}
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                      title="Edit Room"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room.sid);
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                      title="Delete Room"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {room.numParticipants} participants
                  </div>
                  <div className="flex items-center">
                    <VideoCameraIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {room.metadata ? JSON.parse(room.metadata).streams || 0 : 0} streams
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {new Date(room.creationTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        title={`Room Details: ${selectedRoom?.name}`}
      >
        {selectedRoom && (
          <div>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Room Information
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'participants'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Participants
                </button>
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === 'info' ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                    <dl className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Room Name</dt>
                        <dd className="mt-1">
                          <EditableField
                            value={selectedRoom.name}
                            onSave={async (newName) => {
                              const toastId = (window as any).toast.show('Updating room...', 'loading');
                              try {
                                await fetch(`/api/rooms/${selectedRoom.sid}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ name: newName })
                                });
                                (window as any).toast.update(toastId, 'Room updated successfully', 'success');
                              } catch (error) {
                                console.error('Failed to update room:', error);
                                (window as any).toast.update(toastId, 'Failed to update room', 'error');
                                throw error;
                              }
                            }}
                          />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Room ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRoom.sid}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(selectedRoom.creationTime).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Participants</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedRoom.numParticipants}</dd>
                      </div>
                    </dl>
                  </div>

                  {selectedRoom.metadata && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">Additional Details</h4>
                      <div className="mt-2">
                        <CodeBlock code={JSON.stringify(JSON.parse(selectedRoom.metadata), null, 2)} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedRoom.participants?.map((participant) => (
                    <div key={participant.identity} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {participant.name || participant.identity}
                          </h4>
                          <p className="text-sm text-gray-500">Joined {new Date(participant.joinedAt).toLocaleTimeString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleParticipantAction(selectedRoom.sid, participant.identity, 'mute')}
                            className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          >
                            Mute All
                          </button>
                          <button
                            onClick={() => handleParticipantAction(selectedRoom.sid, participant.identity, 'remove')}
                            className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {participant.tracks.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-500">Active Tracks</h5>
                          <div className="mt-1 space-y-1">
                            {participant.tracks.map((track) => (
                              <div key={track.sid} className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-2 ${track.muted ? 'bg-gray-300' : 'bg-green-400'}`} />
                                {track.name || track.type}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsTokenModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Generate Token
              </button>
            </div>
          </div>
        )}
      </Modal>

      <UpdateRoomModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setRoomToUpdate(null);
        }}
        initialData={roomToUpdate}
        onSubmit={async (data) => {
          const toastId = (window as any).toast.show('Updating room...', 'loading');
          try {
            await fetch(`/api/rooms/${roomToUpdate?.sid}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            (window as any).toast.update(toastId, 'Room updated successfully', 'success');
          } catch (error) {
            console.error('Failed to update room:', error);
            (window as any).toast.update(toastId, 'Failed to update room', 'error');
            throw error;
          }
        }}
      />

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          await handleCreateRoom(data);
          setIsCreateModalOpen(false);
        }}
      />

      <TokenGeneratorModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        roomId={selectedRoom?.sid || ''}
        roomName={selectedRoom?.name || ''}
      />
    </>
  );
} 