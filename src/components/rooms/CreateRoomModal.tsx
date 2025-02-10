'use client';

import { UpdateModal } from '../ui/UpdateModal';

const CREATE_ROOM_FIELDS = [
  {
    name: 'name',
    label: 'Room Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Enter room name',
  },
  {
    name: 'emptyTimeout',
    label: 'Empty Timeout',
    type: 'number' as const,
    placeholder: 'Seconds before closing empty room',
    help: 'Number of seconds to keep the room open before any participant joins',
  },
  {
    name: 'departureTimeout',
    label: 'Departure Timeout',
    type: 'number' as const,
    placeholder: 'Seconds after last participant leaves',
    help: 'Number of seconds to keep the room open after the last participant leaves',
  },
  {
    name: 'maxParticipants',
    label: 'Max Participants',
    type: 'number' as const,
    placeholder: 'Maximum number of participants',
    help: 'Limit to the number of participants in a room at a time',
  },
  {
    name: 'metadata',
    label: 'Metadata',
    type: 'text' as const,
    placeholder: 'Room metadata (JSON)',
    help: 'Initial room metadata in JSON format',
  },
  {
    name: 'minPlayoutDelay',
    label: 'Min Playout Delay',
    type: 'number' as const,
    placeholder: 'Minimum delay in milliseconds',
    help: 'Minimum playout delay in milliseconds',
  },
  {
    name: 'maxPlayoutDelay',
    label: 'Max Playout Delay',
    type: 'number' as const,
    placeholder: 'Maximum delay in milliseconds',
    help: 'Maximum playout delay in milliseconds',
  },
  {
    name: 'syncStreams',
    label: 'Sync Streams',
    type: 'boolean' as const,
    help: 'Improves A/V sync with playout delay > 200ms. Not recommended for rooms with frequent subscription changes.',
  }
];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreateRoomModal({ isOpen, onClose, onSubmit }: CreateRoomModalProps) {
  const handleSubmit = async (formData: any) => {
    try {
      const transformedData = {
        ...formData,
        metadata: formData.metadata ? JSON.stringify(JSON.parse(formData.metadata)) : undefined,
        emptyTimeout: formData.emptyTimeout ? parseInt(formData.emptyTimeout) : undefined,
        departureTimeout: formData.departureTimeout ? parseInt(formData.departureTimeout) : undefined,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        minPlayoutDelay: formData.minPlayoutDelay ? parseInt(formData.minPlayoutDelay) : undefined,
        maxPlayoutDelay: formData.maxPlayoutDelay ? parseInt(formData.maxPlayoutDelay) : undefined,
      };

      // Remove undefined values
      Object.keys(transformedData).forEach(key => 
        transformedData[key] === undefined && delete transformedData[key]
      );

      await onSubmit(transformedData);
    } catch (error) {
      console.error('Invalid form data:', error);
      throw new Error('Please check the form data and try again');
    }
  };

  return (
    <UpdateModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Room"
      fields={CREATE_ROOM_FIELDS}
    />
  );
} 