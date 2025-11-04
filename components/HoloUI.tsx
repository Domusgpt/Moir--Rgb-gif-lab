/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clear Seas Solution - Holographic UI Component Library
 */

import React from 'react';

// ============================================================================
// HOLOGRAPHIC BUTTON COMPONENT
// ============================================================================

export interface HoloButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const HoloButton: React.FC<HoloButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  fullWidth = false,
  loading = false
}) => {
  const variantClasses = {
    primary: 'holo-btn-primary',
    secondary: 'holo-btn-secondary',
    danger: 'holo-btn-danger',
    success: 'holo-btn-success'
  };

  const sizeClasses = {
    sm: 'holo-btn-sm',
    md: 'holo-btn-md',
    lg: 'holo-btn-lg'
  };

  return (
    <button
      className={`holo-btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'holo-btn-full' : ''} ${disabled || loading ? 'holo-btn-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="holo-btn-spinner"></span>}
      {!loading && icon && <span className="holo-btn-icon">{icon}</span>}
      <span className="holo-btn-text">{children}</span>
    </button>
  );
};

// ============================================================================
// HOLOGRAPHIC BADGE COMPONENT
// ============================================================================

export interface HoloBadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'magenta' | 'yellow' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const HoloBadge: React.FC<HoloBadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  pulse = false
}) => {
  return (
    <span className={`holo-badge holo-badge-${variant} holo-badge-${size} ${pulse ? 'holo-badge-pulse' : ''}`}>
      {children}
    </span>
  );
};

// ============================================================================
// HOLOGRAPHIC CARD COMPONENT
// ============================================================================

export interface HoloCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  hoverable?: boolean;
  onClick?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  title,
  icon,
  variant = 'default',
  hoverable = false,
  onClick
}) => {
  return (
    <div
      className={`holo-card holo-card-${variant} ${hoverable ? 'holo-card-hoverable' : ''} ${onClick ? 'holo-card-clickable' : ''}`}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className="holo-card-header">
          {icon && <span className="holo-card-icon">{icon}</span>}
          {title && <h3 className="holo-card-title">{title}</h3>}
        </div>
      )}
      <div className="holo-card-content">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// HOLOGRAPHIC TOOLTIP COMPONENT
// ============================================================================

export interface HoloTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HoloTooltip: React.FC<HoloTooltipProps> = ({
  children,
  content,
  position = 'top'
}) => {
  return (
    <div className="holo-tooltip-wrapper">
      {children}
      <div className={`holo-tooltip holo-tooltip-${position}`}>
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// HOLOGRAPHIC PROGRESS BAR
// ============================================================================

export interface HoloProgressProps {
  value: number; // 0-100
  max?: number;
  variant?: 'purple' | 'magenta' | 'yellow' | 'gradient';
  showLabel?: boolean;
  animated?: boolean;
}

export const HoloProgress: React.FC<HoloProgressProps> = ({
  value,
  max = 100,
  variant = 'gradient',
  showLabel = true,
  animated = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="holo-progress">
      <div className={`holo-progress-bar holo-progress-${variant} ${animated ? 'holo-progress-animated' : ''}`}>
        <div
          className="holo-progress-fill"
          style={{ width: `${percentage}%` }}
        >
          {showLabel && (
            <span className="holo-progress-label">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HOLOGRAPHIC NOTIFICATION TOAST
// ============================================================================

export interface HoloToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

export const HoloToast: React.FC<HoloToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    info: '💡',
    success: '✓',
    warning: '⚠️',
    error: '✗'
  };

  return (
    <div className={`holo-toast holo-toast-${type}`}>
      <span className="holo-toast-icon">{icons[type]}</span>
      <span className="holo-toast-message">{message}</span>
      <button className="holo-toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// ============================================================================
// HOLOGRAPHIC STYLES
// ============================================================================

export const HoloUIStyles = `
  /* Button Styles */
  .holo-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .holo-btn-sm { padding: 8px 16px; font-size: 13px; }
  .holo-btn-md { padding: 12px 24px; font-size: 14px; }
  .holo-btn-lg { padding: 16px 32px; font-size: 16px; }
  .holo-btn-full { width: 100%; }

  .holo-btn-primary {
    background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
    background-size: 200% 200%;
    animation: holoShimmer 3s ease-in-out infinite;
    color: #FFFFFF;
    box-shadow: 0 0 20px rgba(176, 38, 255, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .holo-btn-primary:hover:not(.holo-btn-disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 30px rgba(176, 38, 255, 0.8),
                0 6px 20px rgba(255, 0, 110, 0.6);
  }

  .holo-btn-secondary {
    background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9));
    color: #B026FF;
    border: 2px solid rgba(176, 38, 255, 0.5);
    box-shadow: 0 0 15px rgba(176, 38, 255, 0.3);
  }

  .holo-btn-secondary:hover:not(.holo-btn-disabled) {
    border-color: rgba(176, 38, 255, 0.8);
    box-shadow: 0 0 25px rgba(176, 38, 255, 0.6);
    transform: translateY(-2px);
  }

  .holo-btn-danger {
    background: linear-gradient(145deg, rgba(255, 0, 110, 0.9), rgba(255, 0, 110, 0.7));
    color: #FFFFFF;
    box-shadow: 0 0 20px rgba(255, 0, 110, 0.6);
  }

  .holo-btn-danger:hover:not(.holo-btn-disabled) {
    background: linear-gradient(145deg, rgba(255, 0, 110, 1), rgba(255, 0, 110, 0.9));
    box-shadow: 0 0 30px rgba(255, 0, 110, 0.8);
    transform: translateY(-2px);
  }

  .holo-btn-success {
    background: linear-gradient(145deg, rgba(255, 190, 11, 0.9), rgba(255, 190, 11, 0.7));
    color: #000000;
    box-shadow: 0 0 20px rgba(255, 190, 11, 0.6);
  }

  .holo-btn-success:hover:not(.holo-btn-disabled) {
    background: linear-gradient(145deg, rgba(255, 190, 11, 1), rgba(255, 190, 11, 0.9));
    box-shadow: 0 0 30px rgba(255, 190, 11, 0.8);
    transform: translateY(-2px);
  }

  .holo-btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.5);
  }

  .holo-btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #FFFFFF;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Badge Styles */
  .holo-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .holo-badge-sm { padding: 4px 8px; font-size: 10px; }
  .holo-badge-md { padding: 6px 12px; font-size: 11px; }
  .holo-badge-lg { padding: 8px 16px; font-size: 12px; }

  .holo-badge-purple {
    background: rgba(176, 38, 255, 0.2);
    color: #B026FF;
    border: 1px solid #B026FF;
    box-shadow: 0 0 10px rgba(176, 38, 255, 0.5);
  }

  .holo-badge-magenta {
    background: rgba(255, 0, 110, 0.2);
    color: #FF006E;
    border: 1px solid #FF006E;
    box-shadow: 0 0 10px rgba(255, 0, 110, 0.5);
  }

  .holo-badge-yellow {
    background: rgba(255, 190, 11, 0.2);
    color: #FFBE0B;
    border: 1px solid #FFBE0B;
    box-shadow: 0 0 10px rgba(255, 190, 11, 0.5);
  }

  .holo-badge-gradient {
    background: linear-gradient(135deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
    color: #FFFFFF;
    border: none;
    box-shadow: 0 0 15px rgba(176, 38, 255, 0.6);
  }

  .holo-badge-pulse {
    animation: neonPulse 2s ease-in-out infinite;
  }

  /* Card Styles */
  .holo-card {
    background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9));
    border: 2px solid rgba(176, 38, 255, 0.3);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .holo-card-elevated {
    box-shadow: 0 8px 32px rgba(176, 38, 255, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .holo-card-glass {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .holo-card-hoverable:hover {
    transform: translateY(-4px);
    border-color: rgba(176, 38, 255, 0.6);
    box-shadow: 0 12px 32px rgba(176, 38, 255, 0.5);
  }

  .holo-card-clickable {
    cursor: pointer;
  }

  .holo-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(176, 38, 255, 0.3);
  }

  .holo-card-icon {
    font-size: 24px;
    filter: drop-shadow(0 0 10px rgba(176, 38, 255, 0.8));
  }

  .holo-card-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
    text-shadow: 0 0 12px rgba(255, 0, 110, 0.6);
  }

  /* Tooltip Styles */
  .holo-tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .holo-tooltip {
    position: absolute;
    background: linear-gradient(145deg, rgba(26, 26, 26, 0.98), rgba(10, 10, 10, 0.98));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(176, 38, 255, 0.5);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #FFFFFF;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 0 20px rgba(176, 38, 255, 0.6);
  }

  .holo-tooltip-wrapper:hover .holo-tooltip {
    opacity: 1;
    visibility: visible;
  }

  .holo-tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
  }

  .holo-tooltip-wrapper:hover .holo-tooltip-top {
    transform: translateX(-50%) translateY(0);
  }

  .holo-tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
  }

  .holo-tooltip-wrapper:hover .holo-tooltip-bottom {
    transform: translateX(-50%) translateY(0);
  }

  /* Progress Bar Styles */
  .holo-progress {
    width: 100%;
    height: 8px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(176, 38, 255, 0.3);
  }

  .holo-progress-bar {
    height: 100%;
    position: relative;
  }

  .holo-progress-fill {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .holo-progress-gradient .holo-progress-fill {
    background: linear-gradient(90deg, #B026FF 0%, #FF006E 50%, #FFBE0B 100%);
    box-shadow: 0 0 15px rgba(176, 38, 255, 0.6);
  }

  .holo-progress-purple .holo-progress-fill {
    background: #B026FF;
    box-shadow: 0 0 15px rgba(176, 38, 255, 0.6);
  }

  .holo-progress-magenta .holo-progress-fill {
    background: #FF006E;
    box-shadow: 0 0 15px rgba(255, 0, 110, 0.6);
  }

  .holo-progress-yellow .holo-progress-fill {
    background: #FFBE0B;
    box-shadow: 0 0 15px rgba(255, 190, 11, 0.6);
  }

  .holo-progress-animated .holo-progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .holo-progress-label {
    position: absolute;
    font-size: 10px;
    font-weight: 700;
    color: #FFFFFF;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  /* Toast Notification Styles */
  .holo-toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(145deg, rgba(26, 26, 26, 0.98), rgba(10, 10, 10, 0.98));
    backdrop-filter: blur(20px);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8),
                0 0 20px rgba(176, 38, 255, 0.4);
    animation: toastSlideIn 0.3s ease;
  }

  @keyframes toastSlideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .holo-toast-info {
    border-left: 4px solid #B026FF;
  }

  .holo-toast-success {
    border-left: 4px solid #FFBE0B;
  }

  .holo-toast-warning {
    border-left: 4px solid #FF006E;
  }

  .holo-toast-error {
    border-left: 4px solid #FF006E;
  }

  .holo-toast-icon {
    font-size: 20px;
    filter: drop-shadow(0 0 10px rgba(176, 38, 255, 0.8));
  }

  .holo-toast-message {
    flex: 1;
    color: #FFFFFF;
    font-size: 14px;
  }

  .holo-toast-close {
    background: none;
    border: none;
    color: #808080;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .holo-toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
  }
`;
