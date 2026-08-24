import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronRight, MapPinned, Landmark, ShoppingBag, FileSearch, ListChecks,
  Radar, CheckCircle2, ArrowRight, Sparkles,
} from 'lucide-react'
import HeroMap from '../../components/HeroMap'
import FlipCard from '../../components/FlipCard'
import Button from '../../components/Button'
import ClassifierDemo from '../../features/complaints/ClassifierDemo'
import { FEATURED_REPORTS } from '../../data/reports'
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/Badge'
import { formatDate } from '../../utils/status'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const STEPS = [
  { n: '01', title: 'Report', desc: 'Citizen submits a complaint or community issue in minutes, with location and evidence.', icon: FileSearch },
  { n: '02', title: 'Classify', desc: 'The platform identifies the complaint category and the authority best suited to handle it.', icon: ListChecks },
  { n: '03', title: 'Track', desc: 'Citizens follow real-time progress through a transparent, timestamped timeline.', icon: Radar },
  { n: '04', title: 'Resolve', desc: 'The responsible organization handles, updates, and closes out the complaint.', icon: CheckCircle2 },
]

const TYPES = [
  { icon: MapPinned, title: 'Community Issues', desc: 'Bad roads, potholes, flooding, waste, broken streetlights, and other local infrastructure problems.', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Landmark, title: 'Government Services', desc: 'Delays and problems with public offices, hospitals, schools, and other government-delivered services.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: ShoppingBag, title: 'Consumer Complaints', desc: 'Problems with vendors, telecoms, banks, and other paid services — billing, refunds, and service delivery.', color: 'text-navy-800', bg: 'bg-mist-100' },
]

const STATS = [
  { label: 'Reports Logged', value: '12,482' },
  { label: 'Resolved', value: '9,310' },
  { label: 'Resolution Rate', value: '74.5%' },
  { label: 'Avg. Response Time', value: '3.2 days' },
]

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 grain-noise pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,199,181,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(30,95,224,0.2),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-teal-400">
              <Sparkles className="h-3.5 w-3.5" /> A civic-technology prototype for Nigeria
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Report. Track. <span className="text-teal-400">Improve</span> Your Community.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              One platform for reporting community problems, public-service issues, and consumer complaints — with transparent tracking from report to resolution.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/report" size="lg" iconRight={ChevronRight}>Report an Issue</Button>
              <Button as={Link} to="/community" variant="outline-light" size="lg">Explore the Platform</Button>
            </motion.div>
                      </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}>
            <HeroMap />
          </motion.div>
        </div>
      </section>

      {/* TRANSPARENCY STRIP */}
      <section className="border-b border-mist-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-4 lg:px-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <p className="font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">How CivicPulse Works</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">From report to resolution, fully tracked</h2>
        </div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-mist-200 lg:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-teal-400 shadow-lg shadow-navy-900/10">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs text-slate-400">{step.n}</span>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* THREE TYPES */}
      <section className="bg-mist-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">What You Can Report</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Three categories. One place to report them.</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TYPES.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-mist-200 bg-white p-7 transition-shadow hover:shadow-lg hover:shadow-navy-900/5"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${t.bg} ${t.color}`}>
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSIFIER SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Who Should Handle My Complaint?</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">You don't need to know the system. We route it for you.</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              Describe your problem in plain language. CivicPulse suggests the category and the department or organization workflow best suited to handle it — using rule-based keyword matching, architected so a real AI classification service can be added later.
            </p>
          </div>
          <ClassifierDemo />
        </div>
      </section>

      {/* FEATURED REPORTS PREVIEW */}
      <section className="bg-navy-950 grain-noise py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Live From The Community</span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Recently reported issues</h2>
            </div>
            <Link to="/community" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-400 hover:text-teal-300">
              View the community map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {FEATURED_REPORTS.map((r) => (
              <FlipCard
                key={r.id}
                className="h-64"
                front={
                  <div className="flex h-64 flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <TypeBadge typeId={r.typeId} />
                      <span className="font-mono text-[11px] text-slate-500">{r.referenceId}</span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">{r.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{r.location.city}, {r.location.state}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      <PriorityBadge priority={r.priority} />
                    </div>
                    <p className="mt-auto pt-4 text-xs text-slate-500">{formatDate(r.createdAt)} · Hover or tap for details</p>
                  </div>
                }
                back={
                  <div className="flex h-64 flex-col rounded-2xl border border-teal-500/20 bg-navy-900 p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">{r.categoryLabel}</span>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{r.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs text-slate-500">{r.timeline?.length ?? 1} timeline update{(r.timeline?.length ?? 1) === 1 ? '' : 's'}</span>
                      <Link to={`/reports/${r.referenceId}`} className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300">
                        View report <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-800 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,199,181,0.22),transparent_55%)]" />
          <h2 className="relative font-display text-3xl font-semibold text-white sm:text-4xl">Ready to make your community heard?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm text-slate-300">
            Submit your first report in minutes. No complicated forms — just describe what's wrong, and we'll help route it to the right place.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/report" size="lg" iconRight={ChevronRight}>Report an Issue</Button>
            <Button as={Link} to="/signup" variant="outline-light" size="lg">Create Free Account</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
