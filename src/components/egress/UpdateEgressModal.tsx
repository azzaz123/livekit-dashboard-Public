'use client';

import { UpdateModal } from '../ui/UpdateModal';

const EGRESS_FIELDS = [
  {
    name: 'addOutputUrls',
    label: 'Add Output URLs',
    type: 'text' as const,
    placeholder: 'Comma-separated list of new RTMP URLs to stream to',
    help: 'Enter URLs separated by commas (e.g., rtmp://server1/live,rtmp://server2/live)',
  },
  {
    name: 'removeOutputUrls',
    label: 'Remove Output URLs',
    type: 'text' as const,
    placeholder: 'Comma-separated list of RTMP URLs to remove',
    help: 'Enter URLs separated by commas to stop streaming to those destinations',
  }
];

interface UpdateEgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function UpdateEgressModal({ isOpen, onClose, onSubmit, initialData }: UpdateEgressModalProps) {
  // Transform the form data to match the API structure
  const handleSubmit = async (formData: any) => {
    const transformedData = {
      addOutputUrls: formData.addOutputUrls ? formData.addOutputUrls.split(',').map((url: string) => url.trim()) : [],
      removeOutputUrls: formData.removeOutputUrls ? formData.removeOutputUrls.split(',').map((url: string) => url.trim()) : [],
    };

    // Remove empty arrays
    if (transformedData.addOutputUrls.length === 0) {
      delete transformedData.addOutputUrls;
    }
    if (transformedData.removeOutputUrls.length === 0) {
      delete transformedData.removeOutputUrls;
    }

    await onSubmit(transformedData);
  };

  return (
    <UpdateModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Egress Stream"
      fields={EGRESS_FIELDS}
      initialData={initialData}
    />
  );
} 