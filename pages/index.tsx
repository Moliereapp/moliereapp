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
import ScreenHistorique from '../components/ScreenHistorique'
import ScreenProfil from '../components/ScreenProfil'
import ScreenAuth from '../components/moliere-auth'
import { MOTS } from '../lib/mots'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Screen = 'accueil' | 'quiz' | 'carnet' | 'ia' | 'historique' | 'profil'

type MotIA = {
  mot: string
  nature: string
  theme: string
  type?: string
  definition: string
  etymologie: string
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

  async function deconnexion() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const motsQuiz = motsCharges.length > 0
    ? motsCharges.filter(m => m.type !== 'expression').map((m, i) => ({
        id: i + 1, mot: m.mot, nature: m.nature, theme: m.theme,
        definition: m.definition, etymologie: m.etymologie,
        exemples: m.exemples, quiz: m.quiz,
      }))
    : MOTS

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #F5C842', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!bienvenueVu) return (
  <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A' }}>
    <ScreenBienvenue onTermine={() => setBienvenueVu(true)} />
  </div>
)
  
  if (!user) return (
    <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A' }}>
      <Head>
        <title>Molière — Connexion</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ScreenAuth onConnecte={setUser} />
    </div>
  )
if (!onboardingVu) return (
  <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A' }}>
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

      <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #2A2A2A', borderRight: '1px solid #2A2A2A' }}>
        <header style={{ background: '#F5C842', padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>
            Mo<span style={{ color: '#E8402A' }}>l</span>ière
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#E8402A', color: '#111', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px' }}>
              🔥 {streak} jours
            </div>
            <button onClick={() => setScreen('profil')}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', color: '#F5C842', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
              {user.email?.[0]?.toUpperCase() || 'M'}
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {screen === 'accueil' && (
            <ScreenAccueilV2
              favoris={favoris}
              motsUtilises={motUtilises}
              onToggleFavori={toggleFavori}
              onMarquerUtilise={marquerUtilise}
              onMotsCharges={onMotsCharges}
            />
          )}
       {screen === 'quiz' && (
  <ScreenQuiz mots={motsCharges.length > 0 ? motsCharges.filter(m => m.type !== 'expression').map((m, i) => ({
    id: i + 1, mot: m.mot, nature: m.nature, theme: m.theme,
    definition: m.definition, etymologie: m.etymologie,
    exemples: m.exemples, quiz: m.quiz,
  })) : MOTS} onQuizComplete={onQuizComplete} />
)}
          {screen === 'carnet' && <ScreenCarnet />}
          {screen === 'ia' && <ScreenMoliereIA />}
          {screen === 'historique' && <ScreenHistorique />}
          {screen === 'profil' && (
            <ScreenProfil streak={streak} motsVus={motsVusCount} quizCompletes={quizCompletes} scoreTotal={scoreTotal} motUtilises={motUtilises.length} />
          )}
        </main>

        <BottomNav active={screen} onChange={setScreen} />
      </div>
    </>
  )
}
