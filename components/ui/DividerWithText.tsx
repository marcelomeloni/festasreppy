"use client";

interface DividerWithTextProps {
  text: string;
}

export function DividerWithText({ text }: DividerWithTextProps) {
  return (
    <div className="relative my-6 w-full">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-off-white text-gray-400 font-body font-medium">{text}</span>
      </div>
    </div>
  );
}