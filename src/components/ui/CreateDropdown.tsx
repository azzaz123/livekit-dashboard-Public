'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { PlusIcon, VideoCameraIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface CreateDropdownProps {
  onCreateRoom: () => void;
  onGenerateToken: () => void;
}

export function CreateDropdown({ onCreateRoom, onGenerateToken }: CreateDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-150">
        <PlusIcon className="h-5 w-5 mr-2" />
        Create
        <ChevronDownIcon className="h-5 w-5 ml-2 -mr-1" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-surface-200/50">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onCreateRoom}
                  className={`${
                    active ? 'bg-surface-50 text-surface-900' : 'text-surface-700'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <VideoCameraIcon className="h-5 w-5 mr-3 text-surface-400" aria-hidden="true" />
                  New Room
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onGenerateToken}
                  className={`${
                    active ? 'bg-surface-50 text-surface-900' : 'text-surface-700'
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <KeyIcon className="h-5 w-5 mr-3 text-surface-400" aria-hidden="true" />
                  Generate Token
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 