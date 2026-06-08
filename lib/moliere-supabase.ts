import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Profile = {
  id: string
  email: string
  prenom: string
  streak: number
  mots_vus: number
  quiz_completes: number
  score_total: number
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  await supabase.from('profiles').update(updates).eq('id', userId)
}

export async function getFavoris(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('favoris')
    .select('mot')
    .eq('user_id', userId)
  return data?.map(f => f.mot) || []
}

export async function toggleFavoriDB(userId: string, mot: string, estFavori: boolean) {
  if (estFavori) {
    await supabase.from('favoris').delete().eq('user_id', userId).eq('mot', mot)
  } else {
    await supabase.from('favoris').insert({ user_id: userId, mot })
  }
}

export async function getUtilisations(userId: string) {
  const { data } = await supabase
    .from('utilisations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function ajouterUtilisationDB(userId: string, mot: string, phrase: string) {
  await supabase.from('utilisations').insert({
    user_id: userId, mot, phrase,
    date_utilisation: new Date().toISOString().split('T')[0]
  })
}
