'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  label?: string;
  type?: 'text' | 'number';
  className?: string;
}

export function EditableField({ value, onSave, label, type = 'text', className = '' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setEditValue(value); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {label && <span className="text-sm text-gray-500">{label}:</span>}
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={`px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          disabled={isLoading}
        />
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
        >
          <CheckIcon className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center space-x-2">
      {label && <span className="text-sm text-gray-500">{label}:</span>}
      <span className={className}>{value}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
    </div>
  );
} 