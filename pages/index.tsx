import { useState } from 'react'
import Head from 'next/head'
import { MOTS, getMotDuJour } from '../lib/mots'
import { useLocalStorage } from '../lib/useLocalStorage'
import BottomNav from '../components/BottomNav'
import ScreenAccueil from '../components/ScreenAccueil'
import ScreenQuiz from '../components/ScreenQuiz'
import ScreenHistorique from '../components/ScreenHistorique'
import ScreenProfil from '../components/ScreenProfil'

type Screen = 'accueil' | 'quiz' | 'historique' | 'profil'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('accueil')
  const motDuJour = getMotDuJour()

  const [favoris, setFavoris] = useLocalStorage<number[]>('favoris', [])
  const [motsVus, setMotsVus] = useLocalStorage<number[]>('mots_vus', [motDuJour.id])
  const [motUtilises, setMotUtilises] = useLocalStorage<number[]>('mots_utilises', [])
  const [streak, setStreak] = useLocalStorage<number>('streak', 1)
  const [quizCompletes, setQuizCompletes] = useLocalStorage<number>('quiz_completes', 0)
  const [scoreTotal, setScoreTotal] = useLocalStorage<number>('score_total', 0)

  const motUtilise = motUtilises.includes(motDuJour.id)
  const motsVusList = MOTS.filter(m => motsVus.includes(m.id))

  function toggleFavori() {
    setFavoris(favoris.includes(motDuJour.id)
      ? favoris.filter(id => id !== motDuJour.id)
      : [...favoris, motDuJour.id])
  }

  function marquerUtilise() {
    if (!motUtilise) setMotUtilises([...motUtilises, motDuJour.id])
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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        maxWidth: '420px',
        margin: '0 auto',
        minHeight: '100vh',
        background: '#111',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #3A3A3A',
        borderRight: '1px solid #3A3A3A',
      }}>
        <header style={{ background: '#F5C842', padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>
            Mo<span style={{ color: '#E8402A' }}>l</span>ière
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#E8402A', color: '#111', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🔥 {streak} jours
            </div>
            <button
              onClick={() => setScreen('profil')}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', color: '#F5C842', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
              M
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {screen === 'accueil' && (
            <ScreenAccueil
              mot={motDuJour}
              favoris={favoris}
              motUtilise={motUtilise}
              onToggleFavori={toggleFavori}
              onMarquerUtilise={marquerUtilise}
            />
          )}
          {screen === 'quiz' && (
            <ScreenQuiz
              mots={MOTS}
              onQuizComplete={onQuizComplete}
            />
          )}
          {screen === 'historique' && (
            <ScreenHistorique
              mots={motsVusList}
              favoris={favoris}
              motUtilises={motUtilises}
            />
          )}
          {screen === 'profil' && (
            <ScreenProfil
              streak={streak}
              motsVus={motsVus.length}
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
