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

// Admin: Get Dashboard Stats
export async function GET(request) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Total Revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'completed')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // Total Orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })

    // Total Products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Total Users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })

    // Recent Orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Last 7 days revenue
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: lastSevenDaysOrders } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .eq('payment_status', 'completed')
      .gte('created_at', sevenDaysAgo.toISOString())

    // Group by date
    const revenueByDate = {}
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      revenueByDate[dateStr] = 0
    }

    lastSevenDaysOrders?.forEach((order) => {
      const dateStr = new Date(order.created_at).toISOString().split('T')[0]
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += order.total_amount
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalUsers: totalUsers || 0,
        recentOrders: recentOrders || [],
        revenueChart: Object.entries(revenueByDate).map(([date, revenue]) => ({
          date,
          revenue,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
