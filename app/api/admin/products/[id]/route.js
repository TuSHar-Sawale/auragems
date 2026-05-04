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

// Admin: Update Product
export async function PUT(request, { params }) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const productData = await request.json()

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        mrp: productData.mrp,
        stock: productData.stock,
        sku: productData.sku,
        category_id: productData.category_id,
        brand: productData.brand,
        tags: productData.tags,
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        is_new: productData.is_new,
        cod_available: productData.cod_available,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Admin: Delete Product
export async function DELETE(request, { params }) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
