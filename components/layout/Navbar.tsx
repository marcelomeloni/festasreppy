"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlass, MapPin, SpinnerGap, X, List,
  Ticket, UserCircle, SignOut, CaretDown,
} from "@phosphor-icons/react";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/services/searchService";
import SearchDropdown from "@/components/SearchDropdown";

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch]             = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const dropdownRef  = useRef<HTMLDivElement>(null);
  const searchRef    = useRef<HTMLDivElement>(null);

  const { location, status, requestLocation } = useLocation();
  const { user, loading, signOut }            = useAuth();
  const { results, loading: searchLoading }   = useSearch(search);

  const locationLabel =
    status === "loading" ? null
    : location ? `${location.city}${location.state ? `, ${location.state}` : ""}`
    : null;

  const showDropdown = searchFocused && search.trim().length >= 2;

  // Fecha dropdown de user ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "eu";

  async function handleSignOut() {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut();
    window.location.href = "/login";
  }

  function clearSearch() {
    setSearch("");
    setSearchFocused(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-off-white sm:relative sm:top-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3 md:gap-5">

   {/* Logo */}
<Link href="/" className="shrink-0 flex items-center transition-opacity hover:opacity-80">
  <Image
    src="/preto.png"
    alt="Reppy"
    width={200}
    height={64}
    className="h-10 md:h-10 w-auto object-contain"
    priority
  />
</Link>

        {/* Localização — desktop */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <div className="w-px h-6 bg-gray-200" />
          <button onClick={requestLocation} className="flex items-center gap-1.5 group">
            {status === "loading" ? (
              <SpinnerGap size={16} weight="bold" className="animate-spin text-primary" />
            ) : (
              <MapPin size={16} weight="fill" className="text-primary" />
            )}
            <span className="font-body text-[14px] font-semibold text-gray-500 group-hover:text-black transition-colors max-w-[130px] truncate">
              {locationLabel ?? "definir cidade"}
            </span>
          </button>
        </div>

        {/* Busca */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="buscar..."
            className="w-full font-body text-[13px] md:text-[14px] font-medium bg-gray-100 text-black placeholder:text-gray-400 pl-9 md:pl-11 pr-8 md:pr-10 py-2 md:py-2.5 rounded-pill border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={14} weight="bold" />
            </button>
          )}

          {/* Dropdown de resultados */}
          {showDropdown && (
            <SearchDropdown
              results={results}
              loading={searchLoading}
              query={search}
              onClose={clearSearch}
            />
          )}
        </div>

        {/* Direita */}
        <div className="flex items-center gap-3 shrink-0">

          {/* ── DESKTOP ── */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/eventos"
              className="font-bricolage text-[15px] font-bold text-gray-600 hover:text-black tracking-tight transition-colors"
            >
              eventos
            </Link>

            {/* Não logado */}
            {!loading && !user && (
              <Link
                href="/login"
                className="font-bricolage text-[14px] font-extrabold text-black tracking-wide border-2 border-black hover:bg-primary hover:border-primary px-6 py-2 rounded-pill transition-all"
              >
                entrar
              </Link>
            )}

            {/* Logado — avatar + dropdown */}
            {!loading && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-black rounded-full pl-1 pr-3 py-1 transition-all"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={firstName} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <UserCircle size={28} weight="fill" className="text-gray-400" />
                  )}
                  <span className="font-body text-[13px] font-semibold text-black">{firstName}</span>
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white border-2 border-gray-200 rounded-[16px] shadow-lg overflow-hidden z-50">
                    <Link
                      href="/meus-ingressos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-body text-[14px] font-semibold text-black hover:bg-gray-50 transition-colors"
                    >
                      <Ticket size={16} weight="bold" className="text-gray-500" />
                      Meus ingressos
                    </Link>
                    <Link
                      href="/conta"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-body text-[14px] font-semibold text-black hover:bg-gray-50 transition-colors"
                    >
                      <UserCircle size={16} weight="bold" className="text-gray-500" />
                      Minha conta
                    </Link>
                    <div className="h-px bg-gray-100 mx-3" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 font-body text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <SignOut size={16} weight="bold" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── MOBILE: hambúrguer ── */}
          <button
            className="md:hidden p-1.5 text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-gray-200 px-6 pt-5 pb-8 flex flex-col gap-6 bg-off-white shadow-lg absolute w-full left-0">

          {/* Localização */}
          <button
            onClick={() => { requestLocation(); setMobileOpen(false); }}
            className="flex items-center justify-center gap-2 font-body text-[15px] font-semibold text-gray-600 bg-gray-100 p-3 rounded-pill w-full"
          >
            {status === "loading" ? (
              <SpinnerGap size={18} weight="bold" className="animate-spin text-primary" />
            ) : (
              <MapPin size={18} weight="fill" className="text-primary" />
            )}
            {locationLabel ?? "Definir minha cidade"}
          </button>

          <div className="flex flex-col gap-3">
            <Link
              href="/eventos"
              onClick={() => setMobileOpen(false)}
              className="font-bricolage text-[20px] font-bold text-black tracking-tight py-2 border-b border-gray-200 text-center"
            >
              Explorar Eventos
            </Link>

            {/* Não logado */}
            {!loading && !user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="font-bricolage text-[18px] font-extrabold text-black bg-primary text-center py-3 mt-4 rounded-pill hover:bg-primary-dark transition-all"
              >
                Entrar na conta
              </Link>
            )}

            {/* Logado */}
            {!loading && user && (
              <>
                <div className="flex items-center gap-3 py-2 border-b border-gray-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={firstName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <UserCircle size={40} weight="fill" className="text-gray-400" />
                  )}
                  <div>
                    <p className="font-bricolage font-extrabold text-black text-[16px] leading-tight">{firstName}</p>
                    <p className="font-body text-[12px] text-gray-400">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/meus-ingressos"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-bricolage text-[18px] font-bold text-black py-2 border-b border-gray-200"
                >
                  <Ticket size={20} weight="bold" className="text-gray-500" />
                  Meus ingressos
                </Link>

                <Link
                  href="/conta"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 font-bricolage text-[18px] font-bold text-black py-2 border-b border-gray-200"
                >
                  <UserCircle size={20} weight="bold" className="text-gray-500" />
                  Minha conta
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 font-bricolage text-[16px] font-extrabold text-red-500 border-2 border-red-200 py-3 mt-2 rounded-pill hover:bg-red-50 transition-all"
                >
                  <SignOut size={18} weight="bold" />
                  Sair da conta
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}