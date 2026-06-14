import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function WaiterDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'waiter') redirect('/')

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Modo mesero</h1>
          <p className="text-sm text-gray-400 mt-0.5">{profile.full_name}</p>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Mesas', description: 'Ver y gestionar mesas' },
          { label: 'Nuevo pedido', description: 'Tomar pedido en mesa' },
          { label: 'Pedidos activos', description: 'Estado de pedidos' },
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
