/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Holographic Notification System
 */

import React, { useState, useCallback, createContext, useContext } from 'react';
import { HoloToast } from './HoloUI';

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface NotificationContextType {
  notify: (message: string, type?: Notification['type'], duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ============================================================================
// NOTIFICATION CONTEXT
// ============================================================================

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// ============================================================================
// NOTIFICATION PROVIDER COMPONENT
// ============================================================================

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  position = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((
    message: string,
    type: Notification['type'] = 'info',
    duration: number = 3000
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = { id, message, type, duration };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
  }, [maxNotifications]);

  const success = useCallback((message: string, duration?: number) => {
    notify(message, 'success', duration);
  }, [notify]);

  const error = useCallback((message: string, duration?: number) => {
    notify(message, 'error', duration);
  }, [notify]);

  const warning = useCallback((message: string, duration?: number) => {
    notify(message, 'warning', duration);
  }, [notify]);

  const info = useCallback((message: string, duration?: number) => {
    notify(message, 'info', duration);
  }, [notify]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const positionClasses = {
    'top-right': 'notification-container-top-right',
    'top-left': 'notification-container-top-left',
    'bottom-right': 'notification-container-bottom-right',
    'bottom-left': 'notification-container-bottom-left',
    'top-center': 'notification-container-top-center',
    'bottom-center': 'notification-container-bottom-center'
  };

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
      <div className={`notification-container ${positionClasses[position]}`}>
        {notifications.map(notification => (
          <HoloToast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <style>{`
        .notification-container {
          position: fixed;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          pointer-events: none;
        }

        .notification-container > * {
          pointer-events: all;
        }

        .notification-container-top-right {
          top: 24px;
          right: 24px;
        }

        .notification-container-top-left {
          top: 24px;
          left: 24px;
        }

        .notification-container-bottom-right {
          bottom: 24px;
          right: 24px;
        }

        .notification-container-bottom-left {
          bottom: 24px;
          left: 24px;
        }

        .notification-container-top-center {
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
        }

        .notification-container-bottom-center {
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (max-width: 768px) {
          .notification-container {
            max-width: calc(100vw - 32px);
            left: 16px !important;
            right: 16px !important;
            transform: none !important;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

// ============================================================================
// KEYBOARD SHORTCUT HOOK
// ============================================================================

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchesModifiers =
        (modifiers.ctrl === undefined || e.ctrlKey === modifiers.ctrl) &&
        (modifiers.shift === undefined || e.shiftKey === modifiers.shift) &&
        (modifiers.alt === undefined || e.altKey === modifiers.alt);

      if (e.key === key && matchesModifiers) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifiers]);
};

// ============================================================================
// COPY TO CLIPBOARD UTILITY
// ============================================================================

export const useCopyToClipboard = () => {
  const { success, error } = useNotifications();

  const copyToClipboard = useCallback(async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      success(successMessage);
      return true;
    } catch (err) {
      error('Failed to copy to clipboard');
      return false;
    }
  }, [success, error]);

  return copyToClipboard;
};

// ============================================================================
// DOWNLOAD UTILITY
// ============================================================================

export const useDownload = () => {
  const { success, error } = useNotifications();

  const download = useCallback((content: string, filename: string, type: string = 'text/plain') => {
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success(`Downloaded ${filename}`);
      return true;
    } catch (err) {
      error(`Failed to download ${filename}`);
      return false;
    }
  }, [success, error]);

  return download;
};
