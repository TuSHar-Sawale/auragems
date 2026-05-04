import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import razorpay from '@/lib/razorpay'

export async function POST(request) {
  try {
    const { items, shipping, paymentMethod, totalAmount } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          email: shipping.email,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          order_status: 'pending',
          payment_status: 'pending',
          
          // Shipping details
          shipping_name: shipping.name,
          shipping_email: shipping.email,
          shipping_phone: shipping.phone,
          shipping_address_line1: shipping.address_line1,
          shipping_address_line2: shipping.address_line2 || '',
          shipping_city: shipping.city,
          shipping_state: shipping.state,
          shipping_pincode: shipping.pincode,
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // If Razorpay, create Razorpay order
    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: order.order_number,
        notes: {
          orderId: order.id,
        },
      })

      // Update order with Razorpay details
      const { error: updateError } = await supabase
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', order.id)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        id: order.id,
        order_number: order.order_number,
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
      })
    } else {
      // COD order - directly confirm
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          order_status: 'confirmed',
          payment_status: 'pending',
        })
        .eq('id', order.id)

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        id: order.id,
        order_number: order.order_number,
      })
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
