import { useState } from 'react'

export default function Registration({ backendUrl, onRegistered }) {
  const [form, setForm] = useState({ voter_id: '', name: '', email: '' })
  const [pubKey, setPubKey] = useState('')
  const [irisCommit, setIrisCommit] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.voter_id || !form.name || !pubKey || !irisCommit) {
      setMessage('Please complete all fields, generate a key, and capture iris.');
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voter_id: form.voter_id,
          name: form.name,
          email: form.email,
          demographics: {},
          public_key: pubKey,
          iris_commitment: irisCommit,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
      setMessage('Registered successfully. You can proceed to authenticate.')
      onRegistered && onRegistered({ ...form, public_key: pubKey, public_key_hash: data.public_key_hash, iris_commitment: irisCommit })
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const genKey = async () => {
    // Generate an ECC key pair using SubtleCrypto (P-256) as a placeholder
    const keyPair = await window.crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
    const spki = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    const pubHex = [...new Uint8Array(spki)].map(b => b.toString(16).padStart(2, '0')).join('')
    setPubKey(pubHex)
  }

  const handleIris = async () => {
    // Placeholder: we simulate iris capture by hashing a random value + voter_id
    const rnd = crypto.getRandomValues(new Uint8Array(16))
    const hex = [...rnd].map(b => b.toString(16).padStart(2, '0')).join('')
    const msg = new TextEncoder().encode(form.voter_id + ':' + hex)
    const digest = await crypto.subtle.digest('SHA-256', msg)
    const hashHex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
    setIrisCommit(hashHex)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Voter Registration</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10" placeholder="Voter ID" value={form.voter_id} onChange={e=>setForm({...form, voter_id: e.target.value})} />
          <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10" placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={genKey} className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600">Generate Key</button>
          <button type="button" onClick={handleIris} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Capture Iris</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
        </div>
        {pubKey && <p className="text-xs break-all opacity-80">Public Key: {pubKey}</p>}
        {irisCommit && <p className="text-xs break-all opacity-80">Iris Commitment: {irisCommit}</p>}
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  )
}
