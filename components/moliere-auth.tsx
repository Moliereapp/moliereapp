import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  onConnecte: (user: any) => void
}

export default function ScreenAuth({ onConnecte }: Props) {
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  async function connexionGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setErreur('Erreur Google : ' + error.message)
    setLoading(false)
  }

  async function soumettre() {
    if (!email || !motDePasse) { setErreur('Remplis tous les champs.'); return }
    setLoading(true)
    setErreur('')

    if (mode === 'inscription') {
      const { data, error } = await supabase.auth.signUp({ email, password: motDePasse })
      if (error) { setErreur(error.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, email, prenom })
        setSucces('Compte créé ! Vérifie ton email pour confirmer.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
      if (error) { setErreur('Email ou mot de passe incorrect.'); setLoading(false); return }
      if (data.user) onConnecte(data.user)
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#111', padding: '32px 24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#F5C842' }}>
          Mo<span style={{ color: '#E8402A' }}>l</span>ière
        </h1>
        <p style={{ color: '#A0A0A0', fontSize: '14px', marginTop: '6px' }}>
          {mode === 'connexion' ? 'Content de te revoir !' : 'Rejoins la communauté'}
        </p>
      </div>

      {/* Bouton Google */}
      <button onClick={connexionGoogle} disabled={loading}
        style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1.5px solid #3A3A3A', background: '#1C1C1C', color: '#F0F0F0', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '18px' }}>G</span>
        Continuer avec Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '1px', background: '#2A2A2A' }} />
        <span style={{ color: '#555', fontSize: '12px' }}>ou</span>
        <div style={{ flex: 1, height: '1px', background: '#2A2A2A' }} />
      </div>

      {/* Formulaire */}
      {mode === 'inscription' && (
        <input value={prenom} onChange={e => setPrenom(e.target.value)}
          placeholder="Ton prénom"
          style={inputStyle} />
      )}
      <input value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" type="email"
        style={inputStyle} />
      <input value={motDePasse} onChange={e => setMotDePasse(e.target.value)}
        placeholder="Mot de passe" type="password"
        style={inputStyle} />

      {erreur && <p style={{ color: '#FCA5A5', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{erreur}</p>}
      {succes && <p style={{ color: '#4ADE80', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{succes}</p>}

      <button onClick={soumettre} disabled={loading}
        style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: '#F5C842', color: '#111', fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '16px' }}>
        {loading ? 'Chargement…' : mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
      </button>

      <button onClick={() => { setMode(mode === 'connexion' ? 'inscription' : 'connexion'); setErreur(''); setSucces('') }}
        style={{ background: 'none', border: 'none', color: '#A0A0A0', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
        {mode === 'connexion' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
      </button>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 14px', borderRadius: '10px',
  border: '1.5px solid #3A3A3A', background: '#1C1C1C',
  color: '#F0F0F0', fontSize: '14px', marginBottom: '12px',
  fontFamily: 'inherit', outline: 'none',
}
