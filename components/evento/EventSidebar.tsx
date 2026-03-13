"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Tag, ArrowRight } from "@phosphor-icons/react";
import { MarketModal } from "@/components/evento/MarketModal";
import { OfficialLot, OfficialCategory, MarketLot, PlatformFee, EventData } from "@/services/eventsService";
import { buildCartFromSidebar, encodeCart } from "@/services/checkoutService";

function cheapestByType(lots: MarketLot[]): MarketLot[] {
  if (!lots?.length) return [];
  const map = new Map<string, MarketLot>();
  for (const lot of lots) {
    const existing = map.get(lot.title);
    if (!existing || lot.price < existing.price) map.set(lot.title, lot);
  }
  return Array.from(map.values());
}

function safeNum(v: unknown): number {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

const formatBRL = (v: unknown) =>
  safeNum(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatPrice = (v: unknown): { label: string; free: boolean } => {
  const n = safeNum(v);
  return n === 0 ? { label: "Gratuito", free: true } : { label: formatBRL(n), free: false };
};

function formatPercent(decimal: number): string {
  const rounded = Math.round(decimal * 100 * 10) / 10;
  return `${rounded.toLocaleString("pt-BR")}%`;
}

const UNAVAILABLE_LABEL: Record<string, string> = {
  sold_out: "Esgotado",
  expired: "Encerrado",
  not_started: "Em breve",
};

interface EventSidebarProps {
  event: EventData;
  categories: OfficialCategory[];
  marketLots: MarketLot[];
  platformFee: PlatformFee;
}

export function EventSidebar({
  event,
  categories = [],
  marketLots = [],
  platformFee,
}: EventSidebarProps) {
  const router = useRouter();
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [marketOpen, setMarketOpen] = useState(false);

  const fee = {
    percentage: safeNum(platformFee?.percentage),
    fixed: safeNum(platformFee?.fixed),
  };

  const allLots = categories.flatMap((c) => c.lots);

  const selectedType: "free" | "paid" | null = (() => {
    for (const lot of allLots) {
      if ((qtys[lot.id] || 0) > 0) {
        return safeNum(lot.price) === 0 ? "free" : "paid";
      }
    }
    return null;
  })();

  const isLotBlocked = (lot: OfficialLot): boolean => {
    if (selectedType === null) return false;
    const lotIsFree = safeNum(lot.price) === 0;
    return selectedType === "free" ? !lotIsFree : lotIsFree;
  };

  const inc = (id: string) => {
    const lot = allLots.find((l) => l.id === id);
    if (!lot?.available || isLotBlocked(lot)) return;
    setQtys((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  };

  const dec = (id: string) =>
    setQtys((q) => ({ ...q, [id]: Math.max((q[id] || 0) - 1, 0) }));

  function resolveFinalPrice(lot: OfficialLot): number {
    const base = safeNum(lot.price);
    if (base === 0) return 0;
    const pct = safeNum(lot.feePercentage);
    return lot.feePayer === "buyer" ? base + base * pct + fee.fixed : base;
  }

  function handleCheckout() {
    const availableLots = allLots.filter((l) => l.available);
    const cart = buildCartFromSidebar(
      event.id,
      event.slug,
      event.title,
      event.date ?? "",
      event.locationName ?? "",
      event.organizer?.name ?? "",
      availableLots,
      qtys,
      fee,
      resolveFinalPrice
    );
    router.push(`/checkout?cart=${encodeCart(cart)}`);
  }

  const groupedMarketLots = cheapestByType(marketLots);
  const hasMarketLots = groupedMarketLots.length > 0;
  const marketMin = hasMarketLots
    ? Math.min(...groupedMarketLots.map((l) => safeNum(l.price)))
    : 0;

  const totalQty = allLots.reduce((s, l) => s + (l.available ? qtys[l.id] || 0 : 0), 0);
  const cartLines = allLots
    .filter((l) => l.available && (qtys[l.id] || 0) > 0)
    .map((l) => {
      const qty = qtys[l.id];
      const base = safeNum(l.price);
      const finalPrice = resolveFinalPrice(l);
      const lineFee =
        base > 0 && l.feePayer === "buyer"
          ? qty * (base * safeNum(l.feePercentage) + fee.fixed)
          : 0;
      return { ...l, qty, finalPrice, lineTotal: qty * finalPrice, lineFee };
    });

  const subtotal = cartLines.reduce((s, l) => s + l.qty * safeNum(l.price), 0);
  const totalFee = cartLines.reduce((s, l) => s + l.lineFee, 0);
  const grandTotal = cartLines.reduce((s, l) => s + l.lineTotal, 0);
  const allFree = grandTotal === 0 && totalQty > 0;

  const feeLabel = [
    fee.percentage > 0 ? fee.percentage : null,
    fee.fixed > 0 ? formatBRL(fee.fixed) : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <>
      <div className="flex-1 lg:max-w-[35%] w-full">
        <div className="sticky top-24 bg-white border-2 border-black rounded-[24px] p-6 md:p-8 shadow-[6px_6px_0px_#0A0A0A] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bricolage text-[26px] font-extrabold uppercase text-black tracking-tight leading-none">
              Ingressos
            </h2>
            <Ticket size={24} weight="fill" className="text-primary" />
          </div>

          {hasMarketLots && (
            <button
              onClick={() => setMarketOpen(true)}
              className="group flex items-center justify-between gap-3 bg-off-white border-2 border-gray-200 hover:border-black rounded-[16px] px-4 py-3.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg shrink-0">
                  <Tag size={14} weight="bold" className="text-black" />
                </span>
                <div className="text-left">
                  <p className="font-bricolage font-extrabold text-black text-[13px] uppercase tracking-tight leading-tight">
                    Reppy Market
                  </p>
                  <p className="font-body text-[11px] text-gray-500 mt-0.5">
                    {groupedMarketLots.length} tipos a partir de{" "}
                    <span className="font-bold text-black">
                     {formatPrice(marketMin).free ? "Gratuito" : formatBRL(marketMin + 0.8)}
                    </span>
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-0.5 font-body text-[11px] font-bold text-gray-400 group-hover:text-black shrink-0 transition-all group-hover:translate-x-0.5">
                ver <ArrowRight size={11} weight="bold" />
              </span>
            </button>
          )}

          <div className="flex flex-col gap-6">
            {categories.length === 0 ? (
              <p className="font-body text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-[16px]">
                Nenhum ingresso oficial à venda no momento.
              </p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-2">
                  <p className="font-bricolage font-extrabold text-[11px] uppercase tracking-widest text-gray-400 px-1">
                    {category.name}
                  </p>

                  <div className="flex flex-col gap-3">
                    {category.lots.map((lot) => {
                      const qty = qtys[lot.id] || 0;
                      const active = qty > 0;
                      const isAvailable = lot.available ?? true;
                      const blocked = isAvailable && isLotBlocked(lot);
                      const reasonLabel =
                        !isAvailable && lot.unavailableReason
                          ? UNAVAILABLE_LABEL[lot.unavailableReason] ?? null
                          : null;
                      const displayPrice = safeNum(lot.price);
                      const { label: priceLabel, free } = formatPrice(displayPrice);
                      const hasFee =
                        !free &&
                        lot.feePayer === "buyer" &&
                        safeNum(lot.feePercentage) + fee.fixed > 0;
                      const lotFeeLabel =
                        lot.feePercentage > 0
                          ? formatPercent(safeNum(lot.feePercentage))
                          : null;
                      const lotIsFree = safeNum(lot.price) === 0;

                      return (
                        <div
                          key={lot.id}
                          className={`border-2 rounded-[16px] p-5 flex flex-col gap-4 transition-all ${
                            !isAvailable
                              ? "border-gray-100 bg-gray-50 opacity-70"
                              : blocked
                              ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                              : active
                              ? "border-black bg-white shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1.5">
                              <h3
                                className={`font-bricolage font-extrabold text-[16px] uppercase leading-tight ${
                                  !isAvailable || blocked ? "text-gray-400" : "text-black"
                                }`}
                              >
                                {lot.title}
                              </h3>
                              {lot.subtitle && (
                                <p className="font-body text-[12px] text-gray-500">
                                  {lot.subtitle}
                                </p>
                              )}
                              {reasonLabel && (
                                <span className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                                  {reasonLabel}
                                </span>
                              )}
                              {blocked && (
                                <span className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                                  {lotIsFree
                                    ? "Incompatível com pago"
                                    : "Incompatível com gratuito"}
                                </span>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`font-bricolage font-extrabold text-xl leading-none ${
                                  !isAvailable || blocked
                                    ? "text-gray-400"
                                    : free
                                    ? "text-primary"
                                    : "text-black"
                                }`}
                              >
                                {priceLabel}
                              </span>
                              {hasFee && lotFeeLabel && isAvailable && !blocked && (
                                <p className="font-body text-[10px] text-gray-400 mt-0.5">
                                  inclui taxa {lotFeeLabel}
                                </p>
                              )}
                            </div>
                          </div>

                          {isAvailable && !blocked && (
                            <>
                              <hr className="border-t border-gray-100" />
                              <div className="flex items-center justify-between">
                                <span className="font-body text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                  Qtd.
                                </span>
                                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-1 py-1">
                                  <button
                                    onClick={() => dec(lot.id)}
                                    disabled={qty <= 0}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                                      qty > 0
                                        ? "bg-black text-white hover:bg-black/80"
                                        : "text-gray-300 cursor-not-allowed"
                                    }`}
                                  >
                                    −
                                  </button>
                                  <span className="font-body font-extrabold text-black w-4 text-center text-sm">
                                    {qty}
                                  </span>
                                  <button
                                    onClick={() => inc(lot.id)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold text-gray-500 hover:bg-gray-200 transition-all"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-4">
            {totalQty > 0 && (
              <>
                {!allFree && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-gray-500">Subtotal ({totalQty}x)</span>
                      <span className="text-black font-semibold">{formatBRL(subtotal)}</span>
                    </div>
                    {totalFee > 0 && (
                      <div className="flex justify-between font-body text-sm">
                        <span className="text-gray-500">Taxa de serviço ({feeLabel})</span>
                        <span className="text-black font-semibold">{formatBRL(totalFee)}</span>
                      </div>
                    )}
                  </div>
                )}

                <hr className="border-t border-gray-200" />

                <div className="flex items-baseline justify-between">
                  <span className="font-body text-base font-bold text-black">Total</span>
                  <span
                    className={`font-bricolage font-extrabold text-[28px] leading-none ${
                      allFree ? "text-primary" : "text-black"
                    }`}
                    style={{ letterSpacing: "-1px" }}
                  >
                    {allFree ? "Gratuito" : formatBRL(grandTotal)}
                  </span>
                </div>
              </>
            )}

            <button
              onClick={handleCheckout}
              disabled={totalQty === 0}
              className={`w-full font-bricolage font-extrabold text-xl uppercase tracking-wide py-4 rounded-full flex items-center justify-center transition-all ${
                totalQty > 0
                  ? "bg-primary text-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {totalQty > 0
                ? allFree
                  ? "Garantir ingresso"
                  : "Comprar agora"
                : "Selecione um ingresso"}
            </button>
          </div>
        </div>
      </div>

      {marketOpen && (
        <MarketModal lots={groupedMarketLots} onClose={() => setMarketOpen(false)} />
      )}
    </>
  );
}