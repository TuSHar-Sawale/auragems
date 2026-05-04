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

export async function GET(request) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      coupons,
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const couponData = await request.json()

    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert([
        {
          code: couponData.code.toUpperCase(),
          description: couponData.description,
          discount_type: couponData.discountType,
          discount_value: couponData.discountValue,
          max_discount: couponData.maxDiscount,
          min_order_amount: couponData.minOrderAmount,
          usage_limit: couponData.usageLimit,
          expiry_date: couponData.expiryDate,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      coupon,
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
