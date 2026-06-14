import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function OwnerDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, role')
    .eq('id', user!.id)
    .single()

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Panel del dueño</h1>
          <p className="text-sm text-gray-400 mt-0.5">{profile?.full_name}</p>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Ventas', description: 'Resumen del día' },
          { label: 'Caja', description: 'Ingresos y egresos' },
          { label: 'Stock', description: 'Inventario actual' },
          { label: 'Vencimientos', description: 'Alertas próximas' },
          { label: 'Sugerencias de compra', description: 'Motor de compra inteligente' },
          { label: 'Configuración', description: 'Mesas, productos, staff' },
        ].map(card => (
          <div key={card.label} className="rounded-xl bg-gray-900 border border-gray-800 p-5 hover:border-indigo-600 transition-colors cursor-pointer">
            <p className="font-semibold">{card.label}</p>
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
