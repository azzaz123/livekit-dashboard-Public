'use client';

import { UpdateModal } from '../ui/UpdateModal';

const ROOM_FIELDS = [
  {
    name: 'metadata',
    label: 'Room Metadata',
    type: 'text' as const,
    placeholder: 'Room metadata in JSON format',
    help: 'Enter valid JSON metadata (e.g., {"maxParticipants": 10, "recording": true})',
  }
];

interface UpdateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function UpdateRoomModal({ isOpen, onClose, onSubmit, initialData }: UpdateRoomModalProps) {
  // Transform the form data to match the API structure
  const handleSubmit = async (formData: any) => {
    try {
      // Validate JSON
      const metadata = formData.metadata ? JSON.parse(formData.metadata) : {};
      
      const transformedData = {
        metadata: JSON.stringify(metadata)
      };

      await onSubmit(transformedData);
    } catch (error) {
      console.error('Invalid JSON metadata:', error);
      throw new Error('Please enter valid JSON metadata');
    }
  };

  // Format initial metadata if it exists
  const formattedInitialData = initialData ? {
    metadata: initialData.metadata ? JSON.stringify(JSON.parse(initialData.metadata), null, 2) : ''
  } : {};

  return (
    <UpdateModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Room"
      fields={ROOM_FIELDS}
      initialData={formattedInitialData}
    />
  );
} 