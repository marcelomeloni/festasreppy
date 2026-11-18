"use client";

import { useState } from 'react';
import OrganizerHero from '@/components/organizador/OrganizerHero';
import OrganizerTabs from '@/components/organizador/OrganizerTabs';
import OrganizerEventos from '@/components/organizador/OrganizerEventos';
import OrganizerLinks from '@/components/organizador/OrganizerLinks';

interface OrganizerViewProps {
  organizador: {
    nome: string;
    bannerUrl: string | null;
    avatarUrl: string | null;
    cidade: string | null;
    seguidores: number;
    isFollowing: boolean;
    slug: string;
    contatos?: {
      instagram?: string | null;
      email?: string | null;
      whatsapp?: string | null;
    };
    links?: { tipo: string; label: string; url: string }[];
  };
  eventos: {
    id: string;
    slug: string;
    nome: string;
    data: string;
    hora: string;
    local: string;
    imagemUrl: string;
    status: "normal" | "encerrado";
  }[];
}

export default function OrganizerView({
  organizador,
  eventos,
}: OrganizerViewProps) {
  const [activeTab, setActiveTab] = useState<'eventos' | 'links'>('eventos');

  return (
    <>
      <div className="mt-6">
        <OrganizerHero organizador={organizador} />
      </div>
      
      <OrganizerTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-1">
        {activeTab === 'eventos' && <OrganizerEventos eventos={eventos} />}
        {activeTab === 'links' && <OrganizerLinks links={organizador.links} contatos={organizador.contatos} />}
      </div>
    </>
  );
}