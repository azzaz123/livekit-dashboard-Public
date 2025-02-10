'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  fields: Field[];
  initialData?: any;
}

export function UpdateModal({ isOpen, onClose, onSubmit, title, fields, initialData }: UpdateModalProps) {
  // Initialize with empty object if initialData is null/undefined
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return initialData ? { ...initialData } : {};
  });

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Reset to empty object if initialData becomes null
      setFormData({});
    }
  }, [initialData]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely get form values
  const getFieldValue = (fieldName: string, defaultValue: any = '') => {
    return formData && fieldName in formData ? formData[fieldName] : defaultValue;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={getFieldValue(field.name)}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'boolean' ? (
              <input
                type="checkbox"
                name={field.name}
                checked={getFieldValue(field.name, false)}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            ) : (
              <div>
                <input
                  type={field.type}
                  name={field.name}
                  value={getFieldValue(field.name)}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={field.required}
                />
                {field.help && (
                  <p className="mt-1 text-sm text-gray-500">
                    {field.help}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 