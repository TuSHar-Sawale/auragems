import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request, { params }) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        product_images:product_images(id, image_url, alt_text, is_primary, display_order)
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
