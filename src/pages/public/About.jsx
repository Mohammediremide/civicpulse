import { motion } from 'framer-motion'
import { ShieldCheck, Users2, Target, Building2 } from 'lucide-react'

const VALUES = [
  { icon: ShieldCheck, title: 'Trust', desc: 'Every report is handled with clear status tracking and no hidden steps.' },
  { icon: Target, title: 'Accountability', desc: 'Departments and organizations are measured on how they respond, not just what they promise.' },
  { icon: Users2, title: 'Community', desc: 'Citizens see what is happening around them, not just their own report.' },
  { icon: Building2, title: 'Progress', desc: 'Built to grow into real integrations with municipalities and regulators over time.' },
]

export default function About() {
  return (
    <div className="pt-24">
      <section className="mx-auto max-w-4xl px-5 py-16 text-center lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">About CivicPulse</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Building the civic infrastructure Nigeria's communities deserve</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500">
          CivicPulse is a prototype platform designed to unify three things that usually live in separate, disconnected systems: community problems, government service issues, and consumer complaints. Our long-term vision is a serious CivicTech platform that can work with government agencies, regulators, municipalities, and service providers through properly authorized integrations.
        </p>
      </section>

      <section className="bg-mist-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-mist-200 bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-ink-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink-900">An important note on this prototype</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>CivicPulse, as shown here, is an MVP demonstration. It does not use real citizen data, and it is not connected to any real government database or verification system.</p>
          <p>All reports, statistics, and organizations shown throughout this platform are fictional demo data used to illustrate how the product would work in production.</p>
          <p>The architecture is intentionally built so that real authentication, storage, mapping, and classification services can be connected later, without redesigning the product.</p>
        </div>
      </section>
    </div>
  )
}
