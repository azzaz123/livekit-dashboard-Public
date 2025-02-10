'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { XCircleIcon, PencilIcon, ClockIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import CodeBlock from '@/components/ui/CodeBlock';
import { pollingService } from '@/utils/polling-service';
import { EditableField } from '@/components/ui/EditableField';
import { UpdateEgressModal } from '@/components/egress/UpdateEgressModal';

interface EgressDetails {
  egressId: string;
  roomName: string;
  status: string;
  startedAt: string;
  // Add other relevant fields
}

export default function EgressList() {
  const [egresses, setEgresses] = useState<EgressDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEgress, setSelectedEgress] = useState<EgressDetails | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [egressToUpdate, setEgressToUpdate] = useState<EgressDetails | null>(null);

  useEffect(() => {
    return pollingService.subscribe('egresses', (data) => {
      setEgresses(data);
      setLoading(false);
    });
  }, []);

  async function handleStopEgress(egressId: string) {
    const toastId = (window as any).toast.show('Stopping egress...', 'loading');
    
    try {
      await fetch(`/api/egress/${egressId}/stop`, {
        method: 'POST',
      });
      
      // Refresh the list
      const response = await fetch('/api/egress');
      const data = await response.json();
      setEgresses(data);
      
      (window as any).toast.update(toastId, 'Egress stopped successfully', 'success');
    } catch (error) {
      console.error('Failed to stop egress:', error);
      (window as any).toast.update(toastId, 'Failed to stop egress', 'error');
    }
  }

  const handleEdit = (e: React.MouseEvent, egress: EgressDetails) => {
    e.stopPropagation();
    setEgressToUpdate(egress);
    setIsUpdateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
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
              <h2 className="text-base font-semibold text-gray-900">Egress Streams</h2>
              <p className="text-sm text-gray-500 mt-1">Active recording and streaming outputs</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {egresses.length} Total
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {egresses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No active egress</h3>
              <p className="mt-1 text-sm text-gray-500">Start streaming to see egress details.</p>
            </div>
          ) : (
            egresses.map((egress: EgressDetails) => (
              <div 
                key={egress.egressId} 
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedEgress(egress)}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{egress.roomName}</h3>
                      {egress.status === 'ACTIVE' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Recording
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">ID: {egress.egressId}</p>
                  </div>
                  <div className="ml-6 flex items-center space-x-2">
                    <button
                      onClick={(e) => handleEdit(e, egress)}
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                      title="Edit Egress"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopEgress(egress.egressId);
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                      title="Stop Egress"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {new Date(egress.startedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedEgress}
        onClose={() => setSelectedEgress(null)}
        title={`Egress Details: ${selectedEgress?.egressId}`}
      >
        {selectedEgress && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedEgress.egressId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Room</dt>
                  <dd className="mt-1">
                    <EditableField
                      value={selectedEgress.roomName || '—'}
                      onSave={async (newRoom) => {
                        const toastId = (window as any).toast.show('Updating egress...', 'loading');
                        try {
                          await fetch(`/api/egress/${selectedEgress.egressId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ roomName: newRoom })
                          });
                          (window as any).toast.update(toastId, 'Egress updated successfully', 'success');
                        } catch (error) {
                          console.error('Failed to update egress:', error);
                          (window as any).toast.update(toastId, 'Failed to update egress', 'error');
                          throw error;
                        }
                      }}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedEgress.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedEgress.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Started At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(selectedEgress.startedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Additional Details</h4>
              <div className="mt-2">
                <CodeBlock code={JSON.stringify(selectedEgress, null, 2)} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <UpdateEgressModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setEgressToUpdate(null);
        }}
        initialData={egressToUpdate}
        onSubmit={async (data) => {
          const toastId = (window as any).toast.show('Updating egress...', 'loading');
          try {
            await fetch(`/api/egress/${egressToUpdate?.egressId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            (window as any).toast.update(toastId, 'Egress updated successfully', 'success');
          } catch (error) {
            console.error('Failed to update egress:', error);
            (window as any).toast.update(toastId, 'Failed to update egress', 'error');
            throw error;
          }
        }}
      />
    </>
  );
} 