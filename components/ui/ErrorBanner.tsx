"use client";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="w-full mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] font-body text-[13px] text-red-600 flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors ml-4"
          aria-label="Fechar erro"
        >
          ✕
        </button>
      )}
    </div>
  );
}