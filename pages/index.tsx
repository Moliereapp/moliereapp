import { useState } from 'react'
import Head from 'next/head'
import { useLocalStorage } from '../lib/useLocalStorage'
import BottomNav from '../components/BottomNav'
import ScreenAccueilIA from '../components/ScreenAccueilV2'
import ScreenQuiz from '../components/ScreenQuiz'
import ScreenHistorique from '../components/ScreenHistorique'
import ScreenProfil from '../components/ScreenProfil'
import { MOTS } from '../lib/mots'

type Screen = 'accueil' | 'quiz' | 'historique' | 'profil'

type MotIA = {
  mot: string
  nature: string
  theme: string
  definition: string
  etymologie: string
  exemples: { texte: string; contexte: string }[]
  quiz: { correct: string; wrongs: string[]; anecdote: string }
  date: string
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('accueil')
  const [motCharge, setMotCharge] = useState<MotIA | null>(null)

  const [favoris, setFavoris] = useLocalStorage<string[]>('favoris_v2', [])
  const [motUtilises, setMotUtilises] = useLocalStorage<string[]>('mots_utilises_v2', [])
  const [streak] = useLocalStorage<number>('streak', 1)
  const [quizCompletes, setQuizCompletes] = useLocalStorage<number>('quiz_completes', 0)
  const [scoreTotal, setScoreTotal] = useLocalStorage<number>('score_total', 0)
  const [motsVusCount, setMotsVusCount] = useLocalStorage<number>('mots_vus_count', 0)

  const motUtiliseAujourdhui = motCharge ? motUtilises.includes(motCharge.mot) : false

  function toggleFavori(mot: string) {
    setFavoris(favoris.includes(mot) ? favoris.filter(f => f !== mot) : [...favoris, mot])
  }

  function marquerUtilise() {
    if (motCharge && !motUtiliseAujourdhui) {
      setMotUtilises([...motUtilises, motCharge.mot])
    }
  }

  function onMotCharge(mot: MotIA) {
    setMotCharge(mot)
    setMotsVusCount(motsVusCount + 1)
  }

  function onQuizComplete(score: number) {
    setQuizCompletes(quizCompletes + 1)
    setScoreTotal(scoreTotal + score)
  }

  return (
    <>
      <Head>
        <title>Molière — Mot du jour</title>
        <meta name="description" content="Enrichis ton vocabulaire chaque jour avec Molière" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div style={{ maxWidth: '420px', margin: '0 auto', minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #3A3A3A', borderRight: '1px solid #3A3A3A' }}>
        <header style={{ background: '#F5C842', padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>
            Mo<span style={{ color: '#E8402A' }}>l</span>ière
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#E8402A', color: '#111', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px' }}>
              🔥 {streak} jours
            </div>
            <button onClick={() => setScreen('profil')} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', color: '#F5C842', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
              M
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {screen === 'accueil' && (
            <ScreenAccueilIA
              favoris={favoris}
              motUtilise={motUtiliseAujourdhui}
              onToggleFavori={toggleFavori}
              onMarquerUtilise={marquerUtilise}
              onMotsCharges={onMotsCharges}
            />
          )}
          {screen === 'quiz' && (
            <ScreenQuiz
              mots={motCharge ? [{
                id: 1,
                mot: motCharge.mot,
                nature: motCharge.nature,
                theme: motCharge.theme,
                definition: motCharge.definition,
                etymologie: motCharge.etymologie,
                exemples: motCharge.exemples,
                quiz: motCharge.quiz,
              }, ...MOTS.slice(0, 3)] : MOTS}
              onQuizComplete={onQuizComplete}
            />
          )}
          {screen === 'historique' && (
            <ScreenHistorique
              mots={MOTS}
              favoris={[]}
              motUtilises={[]}
            />
          )}
          {screen === 'profil' && (
            <ScreenProfil
              streak={streak}
              motsVus={motsVusCount}
              quizCompletes={quizCompletes}
              scoreTotal={scoreTotal}
              motUtilises={motUtilises.length}
            />
          )}
        </main>

        <BottomNav active={screen} onChange={setScreen} />
      </div>
    </>
  )
}
