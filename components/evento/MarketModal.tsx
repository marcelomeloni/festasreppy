"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, X } from "@phosphor-icons/react";
import { MarketLot } from "@/services/eventsService";
import { encodeMarketCart, MARKET_PLATFORM_FEE } from "@/services/marketCheckoutService";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface MarketModalProps {
  lots:       MarketLot[];
  eventTitle: string;
  eventDate:  string;
  eventVenue: string;
  eventSlug:  string;
  onClose:    () => void;
}

export function MarketModal({
  lots,
  eventTitle,
  eventDate,
  eventVenue,
  eventSlug,
  onClose,
}: MarketModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const lot     = lots.find((l) => l.id === selected);
  const hasItem = !!lot;
  const total   = lot ? lot.price + MARKET_PLATFORM_FEE : 0;

  function handleCheckout() {
    if (!lot) return;
    const encoded = encodeMarketCart({
      listingId:    lot.id,
      eventSlug,
      eventTitle,
      eventDate,
      eventVenue,
      lotTitle:     lot.title,
      categoryName: lot.categoryName,
      sellerPrice:  lot.price,
      platformFee:  MARKET_PLATFORM_FEE,
      total:        lot.price + MARKET_PLATFORM_FEE,
    });
    router.push(`/checkout/market?cart=${encoded}`);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-off-white w-full max-w-[420px] max-h-[90vh] rounded-[28px] border border-gray-200 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 bg-primary rounded-xl shrink-0">
                <Tag size={16} weight="bold" className="text-black" />
              </span>
              <div>
                <h3 className="font-bricolage font-extrabold text-black text-lg uppercase leading-tight tracking-tight">
                  Reppy Market
                </h3>
                <p className="font-body text-[11px] text-gray-400">ingressos da comunidade</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition-all"
            >
              <X size={15} weight="bold" />
            </button>
          </div>

          <div className="flex flex-col gap-3 px-5 mt-5 overflow-y-auto pb-1">
            {lots.map((l) => {
              const active = selected === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setSelected(active ? null : l.id)}
                  className={`w-full flex items-center justify-between gap-4 p-5 rounded-[18px] border-2 transition-all text-left ${
                    active
                      ? "border-black bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-bricolage font-extrabold text-black text-[15px] uppercase leading-tight">
                      {l.title}
                    </h4>
                    {l.categoryName && (
                      <p className="font-body text-[11px] text-gray-400">{l.categoryName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bricolage font-extrabold text-black text-xl leading-none">
                      {formatBRL(l.price + MARKET_PLATFORM_FEE)}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        active ? "bg-black border-black" : "border-gray-300"
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-primary block" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-5 pt-4 pb-6 mt-3 border-t border-gray-200 flex flex-col gap-4">
            {hasItem && (
              <div className="flex justify-between items-baseline">
                <span className="font-body text-base font-bold text-black">Total</span>
                <span
                  className="font-bricolage font-extrabold text-black text-2xl leading-none"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {formatBRL(total)}
                </span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!hasItem}
              className={`w-full font-bricolage font-extrabold text-xl uppercase tracking-wide py-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                hasItem
                  ? "bg-primary text-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {hasItem ? "Comprar agora" : "Selecione um ingresso"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}