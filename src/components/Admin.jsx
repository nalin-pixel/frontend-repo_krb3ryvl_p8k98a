import { useEffect, useState } from 'react'

export default function Admin({ backendUrl }) {
  const [title, setTitle] = useState('General Election')
  const [cands, setCands] = useState([{ id: 'C1', name: 'Alice', party: 'Unity' }, { id: 'C2', name: 'Bob', party: 'Progress' }])
  const [elections, setElections] = useState([])
  const [status, setStatus] = useState('')

  const createElection = async () => {
    setStatus('Creating election...')
    const res = await fetch(`${backendUrl}/api/elections`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description: 'Demo election', candidates: cands }) })
    const data = await res.json()
    if (!res.ok) { setStatus(data.detail || 'Failed'); return }
    setStatus('Election created')
    load()
  }

  const load = async () => {
    const res = await fetch(`${backendUrl}/api/elections`)
    const data = await res.json()
    setElections(data.items || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10" value={title} onChange={e=>setTitle(e.target.value)} />
          <button onClick={createElection} className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600">Create Election</button>
          <button onClick={load} className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20">Refresh</button>
        </div>
        <div className="space-y-3">
          {elections.map(el => (
            <div key={el._id} className="p-4 bg-black/20 rounded-xl border border-white/10">
              <div className="font-semibold">{el.title}</div>
              <div className="text-xs opacity-80">Status: {el.status}</div>
              <div className="mt-2 text-sm">Candidates: {(el.candidates || []).map(c=>c.name).join(', ')}</div>
            </div>
          ))}
        </div>
        {status && <p className="text-sm">{status}</p>}
      </div>
    </div>
  )
}
