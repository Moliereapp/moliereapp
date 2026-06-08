import { useState, useEffect } from 'react'
import { Mot } from '../lib/mots'

type Props = { mots: Mot[]; onQuizComplete: (score: number) => void }
type Phase = 'question' | 'resultat'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ScreenQuiz({ mots, onQuizComplete }: Props) {
  const [questions] = useState(() => shuffle(mots).slice(0, 4))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [choisi, setChoisi] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('question')

  const q = questions[current]
  const choix = q ? shuffle([q.quiz.correct, ...q.quiz.wrongs]) : []
  const progPct = (current / questions.length) * 100

  function choisir(reponse: string) {
    if (choisi) return
    setChoisi(reponse)
    if (reponse === q.quiz.correct) setScore(s => s + 1)
  }

  function suivant() {
    if (current + 1 >= questions.length) {
      setPhase('resultat')
      onQuizComplete(score + (choisi === q.quiz.correct ? 1 : 0))
    } else {
      setCurrent(c => c + 1)
      setChoisi(null)
    }
  }

  function rejouer() {
    setCurrent(0)
    setScore(0)
    setChoisi(null)
    setPhase('question')
  }

  const scoreFinal = score + (choisi === q?.quiz.correct ? 1 : 0)

  if (phase === 'resultat') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', gap: '14px', flex: 1, background: '#111' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#F5C842', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid #333' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#111' }}>{scoreFinal}</span>
          <span style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>/ {questions.length}</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#F0F0F0', textAlign: 'center' }}>
          {scoreFinal === questions.length ? 'Score parfait !' : scoreFinal >= questions.length / 2 ? 'Bien joué !' : 'Encore un effort !'}
        </h2>
        <p style={{ fontSize: '13px', color: '#A0A0A0', textAlign: 'center', lineHeight: 1.6 }}>
          {scoreFinal === questions.length
            ? 'Tu maîtrises ces mots avec brio. Continue sur cette lancée !'
            : scoreFinal >= questions.length / 2
            ? 'Tu es sur la bonne voie. Revois les mots manqués dans l\'historique.'
            : 'Ces mots reviendront dans les prochains quiz. La répétition est la clé !'}
        </p>
        {scoreFinal === questions.length && (
          <span style={{ background: '#F5C842', color: '#111', fontSize: '12px', padding: '5px 14px', borderRadius: '20px', fontWeight: 500 }}>Expert du jour</span>
        )}
        <button onClick={rejouer} style={{ width: '100%', padding: '12px', background: '#F5C842', color: '#111', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>
          Rejouer
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ background: '#2563EB', padding: '14px 18px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#F5C842', marginBottom: '10px' }}>Quiz du jour</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,.15)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#F5C842', borderRadius: '10px', width: `${progPct}%`, transition: 'width .4s' }} />
          </div>
          <span style={{ fontSize: '12px', color: '#F0F0F0', fontWeight: 500 }}>{current} / {questions.length}</span>
        </div>
      </div>

      <div style={{ padding: '16px 18px', flex: 1, background: '#111' }}>
        <span style={{ display: 'inline-block', background: '#172554', color: '#93C5FD', fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', marginBottom: '10px' }}>
          {current % 2 === 0 ? 'Quelle est la définition ?' : 'Quel mot correspond ?'}
        </span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#F0F0F0', marginBottom: '4px' }}>{q.mot}</h3>
        <p style={{ fontSize: '12px', color: '#A0A0A0', marginBottom: '14px', fontStyle: 'italic' }}>{q.nature} — {q.theme}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {choix.map((c, i) => {
            let bg = '#1C1C1C', border = '#3A3A3A', color = '#F0F0F0'
            if (choisi) {
              if (c === q.quiz.correct) { bg = '#052E16'; border = '#16A34A'; color = '#4ADE80' }
              else if (c === choisi) { bg = '#2D0A0A'; border = '#E8402A'; color = '#FCA5A5' }
            }
            return (
              <button key={i} onClick={() => choisir(c)} disabled={!!choisi}
                style={{ padding: '12px 14px', borderRadius: '10px', border: `1.5px solid ${border}`, background: bg, fontSize: '13px', textAlign: 'left', lineHeight: 1.45, color, transition: 'all .15s' }}>
                {c}
              </button>
            )
          })}
        </div>

        {choisi && (
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: choisi === q.quiz.correct ? '#052E16' : '#2D0A0A', border: `1px solid ${choisi === q.quiz.correct ? '#166534' : '#7F1D1D'}` }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: choisi === q.quiz.correct ? '#4ADE80' : '#FCA5A5', marginBottom: '4px' }}>
              {choisi === q.quiz.correct ? 'Bravo !' : 'Pas tout à fait…'}
            </p>
            <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#A0A0A0' }}>{q.quiz.anecdote}</p>
          </div>
        )}
      </div>

      {choisi && (
        <button onClick={suivant} style={{ margin: '0 18px 14px', padding: '12px', background: '#F5C842', color: '#111', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>
          {current < questions.length - 1 ? 'Question suivante →' : 'Voir mes résultats →'}
        </button>
      )}
    </div>
  )
}
