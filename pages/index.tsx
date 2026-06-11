import ScreenBienvenue from '../components/moliere-bienvenue'
import ScreenOnboarding from '../components/moliere-onboarding'
import ScreenMoliereIA from '../components/moliere-ia'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { createClient } from '@supabase/supabase-js'
import { useLocalStorage } from '../lib/useLocalStorage'
import BottomNav from '../components/BottomNav'
import ScreenAccueilV2 from '../components/moliere-accueil-v3'
import ScreenQuiz from '../components/ScreenQuiz'
import ScreenCarnet from '../components/moliere-carnet'
import ScreenPeleMele from '../components/ScreenPeleMele'
import ScreenProfil from '../components/ScreenProfil'
import ScreenAuth from '../components/moliere-auth'
import { MOTS } from '../lib/mots'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Screen = 'accueil' | 'quiz' | 'carnet' | 'ia' | 'pelemele' | 'profil'
type MotIA = {
  mot: string; nature: string; theme: string; type?: string
  definition: string; etymologie: string
  exemples: { texte: string; contexte: string }[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
  date: string
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('accueil')
  const [motsCharges, setMotsCharges] = useState<MotIA[]>([])
  const [user, setUser] = useState<any>(null)
  const [bienvenueVu, setBienvenueVu] = useLocalStorage<boolean>('bienvenue_vu', false)
  const [categoriesChoisies, setCategoriesChoisies] = useLocalStorage<string[]>('categories_choisies', [])
  const [niveauChoisi, setNiveauChoisi] = useLocalStorage<string>('niveau_choisi', 'intermediaire')
  const [onboardingVu, setOnboardingVu] = useLocalStorage<boolean>('onboarding_vu', false)
  const [authLoading, setAuthLoading] = useState(true)
  const [favoris, setFavoris] = useLocalStorage<string[]>('favoris_v2', [])
  const [motUtilises, setMotUtilises] = useLocalStorage<string[]>('mots_utilises_v2', [])
  const [streak] = useLocalStorage<number>('streak', 1)
  const [quizCompletes, setQuizCompletes] = useLocalStorage<number>('quiz_completes', 0)
  const [scoreTotal, setScoreTotal] = useLocalStorage<number>('score_total', 0)
  const [motsVusCount, setMotsVusCount] = useLocalStorage<number>('mots_vus_count', 0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function toggleFavori(mot: string) {
    setFavoris(favoris.includes(mot) ? favoris.filter(f => f !== mot) : [...favoris, mot])
  }
  function marquerUtilise(mot: string) {
    if (!motUtilises.includes(mot)) setMotUtilises([...motUtilises, mot])
  }
  function onMotsCharges(mots: MotIA[]) {
    setMotsCharges(mots)
    setMotsVusCount(motsVusCount + 1)
  }
  function onQuizComplete(score: number) {
    setQuizCompletes(quizCompletes + 1)
    setScoreTotal(scoreTotal + score)
  }

  const wrapStyle = {
    maxWidth: '420px', margin: '0 auto', minHeight: '100vh',
    background: 'var(--sepia-bg)',
    display: 'flex', flexDirection: 'column' as const,
    borderLeft: '1px solid var(--sepia-border)',
    borderRight: '1px solid var(--sepia-border)',
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--sepia-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: '36px', height: '36px', border: '2px solid var(--sepia-surface3)', borderTop: '2px solid var(--sepia-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!bienvenueVu) return <div style={wrapStyle}><ScreenBienvenue onTermine={() => setBienvenueVu(true)} /></div>

  if (!user) return (
    <div style={wrapStyle}>
      <Head><title>Molière — Connexion</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></Head>
      <ScreenAuth onConnecte={setUser} />
    </div>
  )

  if (!onboardingVu) return (
    <div style={wrapStyle}>
      <ScreenOnboarding onTermine={(cats, niveau) => { setCategoriesChoisies(cats); setNiveauChoisi(niveau); setOnboardingVu(true) }} />
    </div>
  )

  return (
    <>
      <Head>
        <title>Molière — Mot du jour</title>
        <meta name="description" content="Enrichis ton vocabulaire chaque jour avec Molière" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div style={wrapStyle}>
        <header style={{ background: 'var(--sepia-surface)', padding: '14px 18px 11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(160,120,60,0.15)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--sepia-bg)', letterSpacing: '-0.3px' }}>
            Mo<span style={{ color: 'var(--sepia-accent)' }}>l</span>ière
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(212,149,106,0.18)', color: 'var(--sepia-accent)', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(212,149,106,0.3)' }}>
              🔥 {streak} jours
            </div>
            <button onClick={() => setScreen('profil')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(212,149,106,0.15)', color: 'var(--sepia-accent)', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(212,149,106,0.3)', cursor: 'pointer' }}>
              {user.email?.[0]?.toUpperCase() || 'M'}
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {screen === 'accueil' && <ScreenAccueilV2 favoris={favoris} motsUtilises={motUtilises} onToggleFavori={toggleFavori} onMarquerUtilise={marquerUtilise} onMotsCharges={onMotsCharges} />}
          {screen === 'quiz' && <ScreenQuiz mots={motsCharges.length > 0 ? motsCharges.filter(m => m.type !== 'expression').map((m, i) => ({ id: i + 1, mot: m.mot, nature: m.nature, theme: m.theme, definition: m.definition, etymologie: m.etymologie, exemples: m.exemples, quiz: m.quiz })) : MOTS} onQuizComplete={onQuizComplete} />}
          {screen === 'carnet' && <ScreenCarnet />}
          {screen === 'ia' && <ScreenMoliereIA />}
          {screen === 'pelemele' && <ScreenPeleMele />}
          {screen === 'profil' && <ScreenProfil streak={streak} motsVus={motsVusCount} quizCompletes={quizCompletes} scoreTotal={scoreTotal} motUtilises={motUtilises.length} />}
        </main>

        <BottomNav active={screen} onChange={setScreen} />
      </div>
    </>
  )
}
