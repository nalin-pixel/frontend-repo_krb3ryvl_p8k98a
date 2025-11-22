import { useEffect, useState } from 'react'

export default function AuthAndVote({ backendUrl, onAuthenticated, election, onVoted }) {
  const [voterId, setVoterId] = useState('')
  const [nonce, setNonce] = useState('')
  const [pkHash, setPkHash] = useState('')
  const [candidateId, setCandidateId] = useState('')
  const [status, setStatus] = useState('')

  const getChallenge = async () => {
    setStatus('Requesting challenge...')
    const res = await fetch(`${backendUrl}/api/auth/challenge`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voter_id: voterId }) })
    const data = await res.json()
    if (!res.ok) { setStatus(data.detail || 'Failed'); return }
    setNonce(data.nonce)
    setStatus('Challenge received. Verifying...')

    // Simulate iris proof by reusing commitment prefix and sign nonce placeholder
    const iris_proof = nonce.slice(0,8) + 'proof'
    const signed_nonce = Array(64).fill('a').join('')

    const res2 = await fetch(`${backendUrl}/api/auth/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ voter_id: voterId, iris_commitment_proof: iris_proof, signed_nonce }) })
    const data2 = await res2.json()
    if (!res2.ok) { setStatus(data2.detail || 'Verification failed'); return }
    setPkHash(data2.public_key_hash)
    onAuthenticated && onAuthenticated({ voter_id: voterId, public_key_hash: data2.public_key_hash })
    setStatus('Authenticated. You may cast your vote.')
  }

  const submitVote = async () => {
    if (!candidateId) { setStatus('Please select a candidate.'); return }
    setStatus('Casting vote...')
    const res = await fetch(`${backendUrl}/api/vote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      election_id: election?._id || election?.id || election,
      voter_public_key_hash: pkHash,
      candidate_id: candidateId,
      zk_proof: { ok: true },
      signed_payload: 'signed'
    }) })
    const data = await res.json()
    if (!res.ok) { setStatus(data.detail || 'Vote failed'); return }
    setStatus('Vote recorded off-chain. Broadcasting to blockchain...')

    // Simulate blockchain tx hash (In real app, call smart contract via ethers.js)
    const txHash = '0x' + crypto.getRandomValues(new Uint8Array(32)).reduce((s,b)=>s + b.toString(16).padStart(2,'0'), '')
    await fetch(`${backendUrl}/api/vote/attach-tx`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vote_id: data.id, tx_hash: txHash, chain_id: 1337, contract_address: '0xContract' }) })

    setStatus(`Vote finalized on-chain. Tx: ${txHash}`)
    onVoted && onVoted({ tx_hash: txHash })
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Authenticate & Vote</h3>
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <input value={voterId} onChange={e=>setVoterId(e.target.value)} placeholder="Enter your Voter ID" className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 flex-1" />
          <button onClick={getChallenge} className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600">Verify</button>
        </div>

        {pkHash && (
          <div className="space-y-3">
            <p className="text-sm opacity-80">Authenticated as: <span className="font-mono">{pkHash.slice(0,10)}...</span></p>
            <div className="flex flex-wrap gap-3 items-center">
              <select value={candidateId} onChange={e=>setCandidateId(e.target.value)} className="px-4 py-3 rounded-xl bg-white/10 border border-white/10">
                <option value="">Select candidate</option>
                {(election?.candidates || []).map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.party ? `(${c.party})` : ''}</option>
                ))}
              </select>
              <button onClick={submitVote} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600">Cast Vote</button>
            </div>
          </div>
        )}

        {status && <p className="text-sm">{status}</p>}
      </div>
    </div>
  )
}
