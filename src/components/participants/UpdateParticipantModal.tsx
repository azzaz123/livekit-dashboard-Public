'use client';

import { UpdateModal } from '../ui/UpdateModal';

const PARTICIPANT_FIELDS = [
  {
    name: 'name',
    label: 'Display Name',
    type: 'text' as const,
    placeholder: 'Participant display name',
  },
  {
    name: 'metadata',
    label: 'Metadata',
    type: 'text' as const,
    placeholder: 'Participant metadata in JSON format',
    help: 'Enter valid JSON metadata',
  },
  {
    name: 'permissions.canSubscribe',
    label: 'Can Subscribe',
    type: 'boolean' as const,
    help: 'Allow participant to subscribe to other tracks',
  },
  {
    name: 'permissions.canPublish',
    label: 'Can Publish',
    type: 'boolean' as const,
    help: 'Allow participant to publish new tracks',
  },
  {
    name: 'permissions.canPublishData',
    label: 'Can Publish Data',
    type: 'boolean' as const,
    help: 'Allow participant to publish data',
  },
  {
    name: 'permissions.canUpdateMetadata',
    label: 'Can Update Metadata',
    type: 'boolean' as const,
    help: 'Allow participant to update own metadata',
  },
  {
    name: 'permissions.hidden',
    label: 'Hidden',
    type: 'boolean' as const,
    help: 'Hide participant from others',
  },
  {
    name: 'permissions.canPublishSources',
    label: 'Allowed Sources',
    type: 'text' as const,
    placeholder: 'camera,microphone,screen_share',
    help: 'Comma-separated list of allowed sources (camera, microphone, screen_share)',
  }
];

interface UpdateParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  roomId: string;
  participantId: string;
}

export function UpdateParticipantModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  roomId,
  participantId 
}: UpdateParticipantModalProps) {
  // Transform the nested data structure for the form
  const flattenedInitialData = initialData ? {
    name: initialData.name || '',
    metadata: initialData.metadata ? JSON.stringify(JSON.parse(initialData.metadata), null, 2) : '',
    'permissions.canSubscribe': initialData.permission?.canSubscribe,
    'permissions.canPublish': initialData.permission?.canPublish,
    'permissions.canPublishData': initialData.permission?.canPublishData,
    'permissions.canUpdateMetadata': initialData.permission?.canUpdateMetadata,
    'permissions.hidden': initialData.permission?.hidden,
    'permissions.canPublishSources': initialData.permission?.canPublishSources?.join(','),
  } : {};

  // Transform the form data back to the API structure
  const handleSubmit = async (formData: any) => {
    try {
      const transformedData = {
        room: roomId,
        identity: participantId,
        name: formData.name || undefined,
        metadata: formData.metadata ? JSON.stringify(JSON.parse(formData.metadata)) : undefined,
        permission: {
          canSubscribe: formData['permissions.canSubscribe'],
          canPublish: formData['permissions.canPublish'],
          canPublishData: formData['permissions.canPublishData'],
          canUpdateMetadata: formData['permissions.canUpdateMetadata'],
          hidden: formData['permissions.hidden'],
          canPublishSources: formData['permissions.canPublishSources']
            ? formData['permissions.canPublishSources'].split(',').map((s: string) => s.trim())
            : undefined,
        }
      };

      // Remove undefined values
      Object.keys(transformedData).forEach(key => 
        transformedData[key] === undefined && delete transformedData[key]
      );
      
      if (Object.keys(transformedData.permission).length === 0) {
        delete transformedData.permission;
      }

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
      title="Update Participant"
      fields={PARTICIPANT_FIELDS}
      initialData={flattenedInitialData}
    />
  );
} 