'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signupWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `https://todo-online-6om5.vercel.app/auth/callback`,
    },
  })

  if (error) {
    console.error('Google OAuth init error:', error.message)
    redirect('/error')
  }

  if (data?.url) {
    redirect(data.url)
  }

  redirect('/')
}