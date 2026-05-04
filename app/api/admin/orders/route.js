import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

async function verifyAdminToken(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { authenticated: false, user: null }
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { authenticated: false, user: null }
  }

  return { authenticated: true, user }
}

// Admin: Get Orders
export async function GET(request) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(id, name)
        )
      `)

    if (status) {
      query = query.eq('order_status', status)
    }

    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: count,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
