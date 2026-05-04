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

  // Check if user is admin in database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.is_admin) {
    return { authenticated: false, user: null }
  }

  return { authenticated: true, user }
}

// Admin: Create Product
export async function POST(request) {
  const { authenticated, user } = await verifyAdminToken(request)
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
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          mrp: productData.mrp,
          stock: productData.stock,
          sku: productData.sku,
          category_id: productData.category_id,
          brand: productData.brand,
          tags: productData.tags || [],
          is_active: productData.is_active !== false,
          is_featured: productData.is_featured || false,
          is_new: productData.is_new || false,
          cod_available: productData.cod_available !== false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
