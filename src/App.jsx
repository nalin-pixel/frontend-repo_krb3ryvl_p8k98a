import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import ThemeToggle from './components/ThemeToggle'
import Registration from './components/Registration'
import AuthAndVote from './components/AuthAndVote'
import Admin from './components/Admin'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [currentElection, setCurrentElection] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Load latest election
    fetch(`${backendUrl}/api/elections`).then(r=>r.json()).then(d=> {
      const latest = (d.items || [])[0]
      setCurrentElection(latest)
    }).catch(()=>{})
  }, [backendUrl])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0f1f] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-20 backdrop-blur bg-transparent/60 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-lg">IrisVote ZK</div>
          <div className="flex items-center gap-3">
            <a href="#vote" className="px-3 py-2 rounded-lg bg-white/10 text-white">Vote</a>
            <a href="#admin" className="px-3 py-2 rounded-lg bg-white/10 text-white">Admin</a>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      <main>
        <Hero theme={theme} onGetStarted={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth'})} />

        <section id="how" className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[{
            title: 'Register', desc: 'Enroll with ID. Iris features stay on your device; only a commitment and your public key are stored.'
          },{
            title: 'Authenticate', desc: 'During voting, re-scan iris and generate a zero-knowledge proof locally to unlock the ballot.'
          },{
            title: 'Vote on-chain', desc: 'Your encrypted vote is signed and recorded on blockchain with an anonymous identifier.'
          }].map((c, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sky-300 font-semibold">Step {i+1}</div>
              <div className="text-xl font-bold mt-2">{c.title}</div>
              <p className="opacity-80 mt-2 text-sm">{c.desc}</p>
            </div>
          ))}
        </section>

        <section id="register" className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-6">
          <Registration backendUrl={backendUrl} onRegistered={()=>{}} />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Current Election</h3>
            {currentElection ? (
              <div>
                <div className="text-lg font-bold">{currentElection.title}</div>
                <ul className="mt-3 list-disc pl-5 opacity-90">
                  {(currentElection.candidates||[]).map((c,i)=>(<li key={i}>{c.name} {c.party?`(${c.party})`:''}</li>))}
                </ul>
              </div>
            ) : (
              <p className="opacity-80">No election yet. Create one in Admin below.</p>
            )}
          </div>
        </section>

        <section id="vote" className="container mx-auto px-6 pb-16">
          <AuthAndVote backendUrl={backendUrl} election={currentElection} onAuthenticated={()=>{}} onVoted={()=>{}} />
        </section>

        <section id="admin" className="container mx-auto px-6 pb-24">
          <Admin backendUrl={backendUrl} />
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="container mx-auto px-6 py-8 text-sm opacity-70">
          Built for demo: ZK + Iris + Blockchain. No biometrics are uploaded; proofs simulated.
        </div>
      </footer>
    </div>
  )
}

export default App
