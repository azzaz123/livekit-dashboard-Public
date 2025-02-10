'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import CodeBlock from '@/components/ui/CodeBlock';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { pollingService } from '@/utils/polling-service';
import { EditableField } from '@/components/ui/EditableField';
import { UpdateIngressModal } from '@/components/ingress/UpdateIngressModal';
import { SignalIcon } from '@heroicons/react/24/outline';

interface IngressDetails {
  ingressId: string;
  name: string;
  state: any;
  streamKey: string;
  url: string;
}

export default function IngressList() {
  const [ingresses, setIngresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngress, setSelectedIngress] = useState<IngressDetails | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [ingressToUpdate, setIngressToUpdate] = useState<IngressDetails | null>(null);

  useEffect(() => {
    return pollingService.subscribe('ingresses', (data) => {
      setIngresses(data);
      setLoading(false);
    });
  }, []);

  function formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  async function handleStopIngress(ingressId: string) {
    const toastId = (window as any).toast.show('Stopping ingress...', 'loading');
    
    try {
      await fetch(`/api/ingress/${ingressId}/stop`, {
        method: 'POST',
      });
      
      // Refresh the list
      const response = await fetch('/api/ingress');
      const data = await response.json();
      setIngresses(data);
      
      (window as any).toast.update(toastId, 'Ingress stopped successfully', 'success');
    } catch (error) {
      console.error('Failed to stop ingress:', error);
      (window as any).toast.update(toastId, 'Failed to stop ingress', 'error');
    }
  }

  const handleEdit = (e: React.MouseEvent, ingress: IngressDetails) => {
    e.stopPropagation();
    setIngressToUpdate(ingress);
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
              <h2 className="text-base font-semibold text-gray-900">Ingress Streams</h2>
              <p className="text-sm text-gray-500 mt-1">Active incoming streams</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {ingresses.length} Active
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {ingresses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <SignalIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No active ingress</h3>
              <p className="mt-1 text-sm text-gray-500">Start streaming to see ingress details.</p>
            </div>
          ) : (
            ingresses.map((ingress) => (
              <div 
                key={ingress.ingressId}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedIngress(ingress)}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{ingress.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 truncate">ID: {ingress.ingressId}</p>
                  </div>
                  <div className="ml-6 flex items-center space-x-2">
                    <button
                      onClick={(e) => handleEdit(e, ingress)}
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                      title="Edit Ingress"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <LoadingButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopIngress(ingress.ingressId);
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                      title="Stop Ingress"
                      loading={loading}
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </LoadingButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedIngress}
        onClose={() => setSelectedIngress(null)}
        title={`Ingress Details: ${selectedIngress?.name}`}
      >
        {selectedIngress && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
              <dl className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedIngress.ingressId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1">
                    <EditableField
                      value={selectedIngress.name}
                      onSave={async (newName) => {
                        const toastId = (window as any).toast.show('Updating ingress...', 'loading');
                        try {
                          await fetch(`/api/ingress/${selectedIngress.ingressId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: newName })
                          });
                          (window as any).toast.update(toastId, 'Ingress updated successfully', 'success');
                        } catch (error) {
                          console.error('Failed to update ingress:', error);
                          (window as any).toast.update(toastId, 'Failed to update ingress', 'error');
                          throw error;
                        }
                      }}
                    />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Connection Details</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stream Key</dt>
                  <dd className="mt-1">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {selectedIngress.streamKey}
                    </code>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">URL</dt>
                  <dd className="mt-1">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {selectedIngress.url}
                    </code>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">State Information</h4>
              <div className="mt-2">
                <CodeBlock code={formatJson(selectedIngress.state)} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <UpdateIngressModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setIngressToUpdate(null);
        }}
        initialData={ingressToUpdate}
        onSubmit={async (data) => {
          const toastId = (window as any).toast.show('Updating ingress...', 'loading');
          try {
            await fetch(`/api/ingress/${ingressToUpdate?.ingressId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            (window as any).toast.update(toastId, 'Ingress updated successfully', 'success');
          } catch (error) {
            console.error('Failed to update ingress:', error);
            (window as any).toast.update(toastId, 'Failed to update ingress', 'error');
            throw error;
          }
        }}
      />
    </>
  );
} 