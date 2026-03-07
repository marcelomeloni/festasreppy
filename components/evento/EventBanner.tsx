"use client";

// 👇 Adicione a tipagem aqui
export function EventBanner({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
      <div className="w-full aspect-video md:aspect-[16/9] bg-black rounded-[10px] overflow-hidden border-2 border-black relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Banner do evento" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <h1 className="font-bricolage text-5xl md:text-7xl text-primary opacity-50 uppercase tracking-tighter text-center px-4">
              Banner da Festa
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}