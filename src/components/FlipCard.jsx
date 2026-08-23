import { useState } from 'react'
import { motion } from 'framer-motion'

// A generic flip card: pass `front` and `back` React nodes, each expected to
// fill the card (same padding/sizing). Flips on hover for pointer devices
// and on tap/click for touch devices, so it works without a mouse too.
export default function FlipCard({ front, back, className = '' }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`group [perspective:1400px] ${className}`}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f) } }}
      aria-label="Flip card for more detail"
    >
      <motion.div
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="[backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </div>
  )
}
