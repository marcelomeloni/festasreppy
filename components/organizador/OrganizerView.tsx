"use client";

import { useState } from 'react';
import OrganizerHero from '@/components/organizador/OrganizerHero';
import OrganizerTabs from '@/components/organizador/OrganizerTabs';
import OrganizerEventos from '@/components/organizador/OrganizerEventos';
import OrganizerLinks from '@/components/organizador/OrganizerLinks';

// Ele só recebe os dados prontos por props
export default function OrganizerView({ organizador, eventos }: any) {
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