'use client'

import { useState } from 'react'
import { UtensilsCrossed, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { loginAction } from './actions'

const FEATURES = [
  'Pedidos en tiempo real por mesa',
  'Roles separados: cocina, barra y mesero',
  'Control de inventario y vencimientos',
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await loginAction(email, password)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex">

      {/* ── Left panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden border-r border-white/[0.04]">
        {/* Ambient blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-16 w-[400px] h-[400px] bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-900/50">
            <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-white font-semibold tracking-tight">Servicio Restaurante</span>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Sistema de gestión en vivo
            </div>
            <h2 className="font-cormorant text-5xl font-bold text-white leading-[1.1]">
              Todo tu restaurante,<br />
              <span className="text-amber-400">en un solo lugar.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
              Coordina cocina, barra y sala con fluidez. Sin papel, sin confusión.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2} />
                <span className="text-gray-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-gray-700 text-xs">© 2026 Servicio Restaurante</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-[380px] space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-white font-semibold">Servicio Restaurante</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="font-cormorant text-2xl font-bold text-white">Bienvenido de vuelta</h1>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 tracking-wide">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@restaurante.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/40 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-sm transition-all shadow-lg shadow-amber-900/30 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider hint */}
          <p className="text-center text-xs text-gray-700">
            Acceso exclusivo para personal autorizado
          </p>
        </div>
      </div>
    </div>
  )
}
