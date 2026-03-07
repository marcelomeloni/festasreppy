'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SpinnerGap } from '@phosphor-icons/react'
import AccountHero   from '@/components/conta/AccountHero'
import AccountForm   from '@/components/conta/AccountForm'
import AccountDanger from '@/components/conta/AccountDanger'
import { supabase, useAuth } from '@/contexts/AuthContext'
import { userService, type UserProfile } from '@/services/userService'

export default function ContaPage() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [usuario, setUsuario] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession()
      const uid = data.session?.user?.id
      if (!uid) { router.replace('/login'); return }
      try {
        const profile = await userService.getProfile(uid)
        setUsuario(profile)
      } catch { router.replace('/login') }
      finally { setLoading(false) }
    }
    load()
  }, [router])

  async function handleSave(payload: { fullName: string; phone: string; instagram: string }) {
    if (!usuario) return
    setSaveError(null); setSaveSuccess(false)
    try {
      await userService.updateProfile(usuario.id, payload)
      setUsuario((prev) => prev ? { ...prev, ...payload } : prev)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar.')
    }
  }

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
      <SpinnerGap size={32} weight="bold" className="animate-spin text-primary" />
    </main>
  )

  if (!usuario) return null

  return (
    <main className="min-h-screen bg-[#F7F7F2] pb-20">
      <div className="max-w-[600px] mx-auto px-4 pt-8 flex flex-col gap-8">
        <div>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-1">Configurações</p>
          <h1 className="font-bricolage text-[32px] font-extrabold text-[#0A0A0A] tracking-tight leading-none">Minha conta</h1>
        </div>
        <AccountHero usuario={usuario} />
        <section className="bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] p-6">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-6">Dados do perfil</p>
          {saveError && <p className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] font-body text-[13px] text-red-600">{saveError}</p>}
          {saveSuccess && <p className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-[12px] font-body text-[13px] text-green-700">Alterações salvas!</p>}
          <AccountForm usuario={usuario} onSave={handleSave} />
        </section>
        <div className="h-px bg-[#E0E0D8]" />
        <section>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-3">Conta</p>
          <AccountDanger onLogout={handleLogout} onDeleteAccount={() => console.log('excluir')} />
        </section>
      </div>
    </main>
  )
}