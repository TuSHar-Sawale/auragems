import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { verifyPaymentSignature } from '@/lib/helpers'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json()

    if (!order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET
    const message = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed' },
        { status: 400 }
      )
    }

    // Update order in database
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        order_status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('id', order_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
