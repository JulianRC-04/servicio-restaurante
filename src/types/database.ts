export type UserRole = 'owner' | 'waiter' | 'kitchen' | 'bar'
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning'
export type ProductDestination = 'kitchen' | 'bar' | 'both'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type OrderMode = 'qr' | 'waiter' | 'both'
export type ItemStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          restaurant_id: string | null
          full_name: string | null
          role: UserRole
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
        Relationships: []
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          number: number
          capacity: number
          status: TableStatus
          qr_code: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tables']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tables']['Insert']>
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          stock: number
          destination: ProductDestination
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      inventory_lots: {
        Row: {
          id: string
          product_id: string
          quantity: number
          entry_date: string
          expiry_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_lots']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_lots']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          table_id: string
          waiter_id: string | null
          status: OrderStatus
          mode: OrderMode
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          status: ItemStatus
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      auth_role: { Args: Record<never, never>; Returns: UserRole }
      auth_restaurant_id: { Args: Record<never, never>; Returns: string }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
