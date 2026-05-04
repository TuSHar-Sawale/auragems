import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      )
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 400 }
      )
    }

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      )
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      )
    }

    // Check minimum order amount
    if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
      return NextResponse.json(
        { success: false, error: `Minimum order amount is ₹${coupon.min_order_amount}` },
        { status: 400 }
      )
    }

    // Calculate discount
    let discount = 0
    if (coupon.discount_type === 'percentage') {
      discount = (cartTotal * coupon.discount_value) / 100
    } else {
      discount = coupon.discount_value
    }

    // Apply max discount if set
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount,
        discountType: coupon.discount_type,
        description: coupon.description,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
