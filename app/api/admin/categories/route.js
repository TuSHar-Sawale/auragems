import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateSlug } from '@/lib/helpers'

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

export async function POST(request) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { name, description, slug, icon_url } = await request.json()

    const categorySlug = slug || generateSlug(name)

    const { data: category, error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          slug: categorySlug,
          description,
          icon_url,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
