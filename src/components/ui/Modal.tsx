'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        if (!closeOnEscape) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, closeOnEscape]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full bg-card rounded-lg border border-border shadow-md',
                    'transform transition-all duration-150',
                    'animate-scale-in',
                    sizeClasses[size],
                    className
                )}
                tabIndex={-1}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        {title && (
                            <h2 id="modal-title" className="text-base font-semibold text-foreground">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
                                aria-label="Fermer"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

// Confirm Modal Component
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    loading = false,
}) => {
    const variantClasses = {
        danger: 'bg-error hover:bg-error/90 focus-visible:ring-error',
        warning: 'bg-warning hover:bg-warning/90 focus-visible:ring-warning',
        info: 'bg-foreground hover:bg-gray-700 focus-visible:ring-foreground',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-3 py-1.5 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 disabled:opacity-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            'px-3 py-1.5 text-sm font-medium text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors',
                            variantClasses[variant]
                        )}
                    >
                        {loading ? 'Chargement...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default Modal;
