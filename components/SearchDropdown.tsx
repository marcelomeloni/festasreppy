"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { SpinnerGap, CalendarBlank, Buildings } from "@phosphor-icons/react";
import { SearchResult } from "@/services/searchService";

interface SearchDropdownProps {
  results:  SearchResult[];
  loading:  boolean;
  query:    string;
  onClose:  () => void;
}

function ResultItem({ result, onClose }: { result: SearchResult; onClose: () => void }) {
  const router = useRouter();

  function handleClick() {
    onClose();
    router.push(
      result.type === "event"
        ? `/${result.slug}`
        : `/organizador/${result.slug}`
    );
  }

  const isEvent = result.type === "event";

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left group"
    >
      {/* Thumbnail ou ícone fallback */}
      <div className="shrink-0 w-10 h-10 rounded-[10px] overflow-hidden bg-gray-100 flex items-center justify-center">
        {result.imageUrl ? (
          <Image
            src={result.imageUrl}
            alt={result.title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : isEvent ? (
          <CalendarBlank size={18} weight="bold" className="text-gray-400" />
        ) : (
          <Buildings size={18} weight="bold" className="text-gray-400" />
        )}
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[14px] font-bold text-black truncate leading-tight">
          {result.title}
        </p>
        {result.subtitle && (
          <p className="font-body text-[12px] text-gray-400 truncate mt-0.5">
            {result.subtitle}
          </p>
        )}
      </div>

    
    </button>
  );
}

export default function SearchDropdown({ results, loading, query, onClose }: SearchDropdownProps) {
  const isEmpty   = !loading && results.length === 0 && query.trim().length >= 2;
  const isShort   = query.trim().length < 2;

  if (isShort) return null;

  return (
    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border-2 border-gray-200 rounded-[20px] shadow-xl overflow-hidden z-50">

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 px-4 py-4">
          <SpinnerGap size={16} weight="bold" className="animate-spin text-primary shrink-0" />
          <span className="font-body text-[13px] text-gray-400">buscando...</span>
        </div>
      )}

      {/* Resultados */}
      {!loading && results.length > 0 && (
        <div className="py-1.5">
          {/* Separador de seção se tiver dos dois tipos */}
          {results.some(r => r.type === "event") && (
            <p className="px-4 pt-2 pb-1 font-display text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Eventos
            </p>
          )}
          {results.filter(r => r.type === "event").map(r => (
            <ResultItem key={r.id} result={r} onClose={onClose} />
          ))}

          {results.some(r => r.type === "organization") && (
            <>
              <div className="h-px bg-gray-100 mx-4 my-1" />
              <p className="px-4 pt-1 pb-1 font-display text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Organizadores
              </p>
              {results.filter(r => r.type === "organization").map(r => (
                <ResultItem key={r.id} result={r} onClose={onClose} />
              ))}
            </>
          )}
        </div>
      )}

      {/* Sem resultados */}
      {isEmpty && (
        <div className="px-4 py-5 text-center">
          <p className="font-display text-[14px] font-bold text-black">
            Nada por aqui
          </p>
          <p className="font-body text-[12px] text-gray-400 mt-0.5">
            Tenta outro nome ou cidade
          </p>
        </div>
      )}

    </div>
  );
}
