"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="relative bg-white rounded-card shadow-card-hover w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-cream-border">
            <h3 className="text-xl font-serif font-semibold text-charcoal">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-cream-dark transition-colors"
            >
              <X className="w-5 h-5 text-gray" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cream-dark transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray" />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
