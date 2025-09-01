import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'; // Ensures this route is always run dynamically

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Create a Supabase client that can manage cookies
    const supabase = createRouteHandlerClient({ cookies })
    // Exchange the temporary code for a secure user session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // After the session is created, redirect the user to the homepage
  return NextResponse.redirect(requestUrl.origin)
}