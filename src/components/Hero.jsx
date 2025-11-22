import Spline from '@splinetool/react-spline';

export default function Hero({ theme, onGetStarted }) {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 dark:bg-white/10 text-white backdrop-blur">
            Privacy-Preserving Voting
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow">
            Iris Recognition + Zero‑Knowledge Proofs + Blockchain
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl">
            Authenticate locally with your iris, prove legitimacy without revealing identity, and cast an immutable, auditable vote recorded on-chain.
          </p>
          <div className="mt-8 flex gap-3">
            <button onClick={onGetStarted} className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/30 transition">
              Get Started
            </button>
            <a href="#how" className="px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold transition">
              How it works
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0f1f]" />
    </section>
  );
}
