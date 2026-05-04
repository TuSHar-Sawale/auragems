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

export async function PUT(request, { params }) {
  const { authenticated } = await verifyAdminToken(request)
  if (!authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { is_blocked } = await request.json()

    const { data: user, error } = await supabase
      .from('users')
      .update({ is_blocked })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
