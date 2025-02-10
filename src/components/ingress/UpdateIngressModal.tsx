'use client';

import { UpdateModal } from '../ui/UpdateModal';

const INGRESS_FIELDS = [
  {
    name: 'name',
    label: 'Ingress Name',
    type: 'text' as const,
    placeholder: 'Name of the ingress',
  },
  {
    name: 'roomName',
    label: 'Room Name',
    type: 'text' as const,
    placeholder: 'Name of the room to send media to',
  },
  {
    name: 'participantIdentity',
    label: 'Participant Identity',
    type: 'text' as const,
    placeholder: 'Unique identity of the participant',
  },
  {
    name: 'participantName',
    label: 'Participant Name',
    type: 'text' as const,
    placeholder: 'Display name of the participant',
  },
  {
    name: 'participantMetadata',
    label: 'Participant Metadata',
    type: 'text' as const,
    placeholder: 'Metadata to attach to the participant (JSON)',
  },
  {
    name: 'enableTranscoding',
    label: 'Enable Transcoding',
    type: 'boolean' as const,
  },
  {
    name: 'audio.stereo',
    label: 'Audio Stereo',
    type: 'boolean' as const,
  },
  {
    name: 'audio.sampleRate',
    label: 'Audio Sample Rate',
    type: 'select' as const,
    options: ['44100', '48000'],
    placeholder: 'Audio sample rate in Hz',
  },
  {
    name: 'video.width',
    label: 'Video Width',
    type: 'number' as const,
    placeholder: 'Video width in pixels',
  },
  {
    name: 'video.height',
    label: 'Video Height',
    type: 'number' as const,
    placeholder: 'Video height in pixels',
  },
  {
    name: 'video.fps',
    label: 'Video FPS',
    type: 'number' as const,
    placeholder: 'Video frames per second',
  },
  {
    name: 'video.codec',
    label: 'Video Codec',
    type: 'select' as const,
    options: ['h264', 'vp8'],
    placeholder: 'Video codec to use',
  }
];

interface UpdateIngressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function UpdateIngressModal({ isOpen, onClose, onSubmit, initialData }: UpdateIngressModalProps) {
  // Transform the nested data structure for the form
  const flattenedInitialData = initialData ? {
    ...initialData,
    'audio.stereo': initialData.audio?.stereo,
    'audio.sampleRate': initialData.audio?.sampleRate,
    'video.width': initialData.video?.width,
    'video.height': initialData.video?.height,
    'video.fps': initialData.video?.fps,
    'video.codec': initialData.video?.codec,
  } : {};

  // Transform the flat form data back to the nested structure expected by the API
  const handleSubmit = async (formData: any) => {
    const transformedData = {
      ...formData,
      audio: {
        stereo: formData['audio.stereo'],
        sampleRate: formData['audio.sampleRate'],
      },
      video: {
        width: formData['video.width'],
        height: formData['video.height'],
        fps: formData['video.fps'],
        codec: formData['video.codec'],
      },
    };

    // Remove the flattened fields
    delete transformedData['audio.stereo'];
    delete transformedData['audio.sampleRate'];
    delete transformedData['video.width'];
    delete transformedData['video.height'];
    delete transformedData['video.fps'];
    delete transformedData['video.codec'];

    // Remove empty objects
    if (Object.keys(transformedData.audio).every(key => !transformedData.audio[key])) {
      delete transformedData.audio;
    }
    if (Object.keys(transformedData.video).every(key => !transformedData.video[key])) {
      delete transformedData.video;
    }

    await onSubmit(transformedData);
  };

  return (
    <UpdateModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Ingress"
      fields={INGRESS_FIELDS}
      initialData={flattenedInitialData}
    />
  );
} 