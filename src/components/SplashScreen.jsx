import { motion } from 'framer-motion'

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-navy-950 grain-noise">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(20,199,181,0.16),transparent_55%)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Pulse rings echoing the brand mark / hero map markers */}
          {[0, 0.4, 0.8].map((delay) => (
            <motion.span
              key={delay}
              className="absolute h-16 w-16 rounded-full border border-teal-400/40"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay }}
            />
          ))}

          <motion.svg
            width="44"
            height="44"
            viewBox="0 0 64 64"
            fill="none"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10"
          >
            <rect width="64" height="64" rx="14" fill="#0A1B33" />
            <path d="M32 50C32 50 48 38.5 48 26.5C48 17.9 41 11 32 11C23 11 16 17.9 16 26.5C16 38.5 32 50 32 50Z" stroke="#14C7B5" strokeWidth="3" strokeLinejoin="round" />
            <path d="M16 27H23L27 19L33 35L37 27H48" stroke="#F5F7FA" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-6 font-display text-lg font-semibold text-white"
        >
          Civic<span className="text-teal-400">Pulse</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="mt-1.5 text-xs text-slate-400"
        >
          Report. Track. Improve Your Community.
        </motion.p>

        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-teal-400"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
