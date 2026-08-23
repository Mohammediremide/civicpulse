import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronLeft, ChevronRight, CheckCircle2, Paperclip, Send, ShieldCheck } from "lucide-react";
import { Field } from "../../components/ui/FormFields.jsx";
import { PulseMap } from "../../components/PulseMap.jsx";
import { TYPE_META, CATEGORY_OPTIONS } from "../../utils/typeMeta.js";
import { classify } from "../../features/complaints/classify.js";
import { useReports } from "../../features/complaints/ReportsContext.jsx";

const STEP_LABELS = ["Type", "Category", "Describe", "Location", "Evidence", "Review"];
const TOTAL_STEPS = 6;

export default function ReportWizard() {
  const navigate = useNavigate();
  const { addReport } = useReports();

  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(null);

  const suggestion = useMemo(() => (desc ? classify(desc) : null), [desc]);

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    const record = addReport({
      title: title || "Untitled report",
      type,
      category,
      location: location || "Lagos, Nigeria",
      x: 40 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      priority,
      description: desc,
    });
    setSubmitted(record);
    setStep(7);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {step <= TOTAL_STEPS && (
        <div className="flex items-center gap-2 mb-8">
          {STEP_LABELS.map((l, i) => (
            <div key={l} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${i + 1 <= step ? "bg-[#1F4FD8] text-white" : "bg-slate-200 text-slate-500"}`}>
                {i + 1 < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`h-0.5 flex-1 ${i + 1 < step ? "bg-[#1F4FD8]" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-9">
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">What would you like to report?</h2>
            <p className="text-sm text-slate-500 mt-1">Choose the option that best fits your issue — we'll route it correctly.</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {Object.entries(TYPE_META).map(([key, m]) => (
                <button key={key} onClick={() => { setType(key); setCategory(""); }}
                  className={`text-left rounded-2xl border-2 p-5 transition-colors ${type === key ? "border-[#1F4FD8] bg-[#1F4FD8]/5" : "border-slate-200 hover:border-slate-300"}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}14` }}>
                    <m.icon size={18} style={{ color: m.color }} />
                  </div>
                  <div className="font-semibold text-sm text-[#0A1B2E] mt-3">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">Choose a category</h2>
            <p className="text-sm text-slate-500 mt-1">This helps us find the right department for your {type && TYPE_META[type].label.toLowerCase()}.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {(CATEGORY_OPTIONS[type] || []).map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${category === c ? "border-[#1F4FD8] bg-[#1F4FD8]/5 text-[#1F4FD8]" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">Describe the problem</h2>
            <p className="text-sm text-slate-500 mt-1">Give it a short title and describe what's happening in your own words.</p>
            <div className="mt-6 flex flex-col gap-4">
              <Field label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Broken streetlight on Allen Avenue" />
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Description</span>
                <textarea rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's the issue? When did you notice it?"
                  className="w-full mt-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/25 focus:border-[#1F4FD8] resize-none" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">Priority / urgency</span>
                <div className="flex gap-2 mt-1.5">
                  {["Normal", "Medium", "High", "Critical"].map((p) => (
                    <button type="button" key={p} onClick={() => setPriority(p)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border ${priority === p ? "border-[#1F4FD8] bg-[#1F4FD8]/10 text-[#1F4FD8]" : "border-slate-200 text-slate-500"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </label>
              {suggestion && (
                <div className="rounded-xl bg-[#EAF6F4] border border-[#0E9C8C]/20 px-4 py-3 text-sm text-[#0E9C8C] flex items-center gap-2">
                  <ShieldCheck size={16} /> Suggested routing: <strong>{suggestion.authority}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">Where is this happening?</h2>
            <p className="text-sm text-slate-500 mt-1">Add an address, or drop a pin on the map.</p>
            <div className="mt-6 flex flex-col gap-4">
              <Field label="Address / landmark" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Allen Avenue, Ikeja, Lagos" />
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <PulseMap reports={[]} height={220} showHotspots />
              </div>
              <p className="text-xs text-slate-400">Demo map — tap an area in a full build to drop a precise pin. Location search and geocoding connect here in production (see src/services/geocodeService.js).</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">Attach evidence</h2>
            <p className="text-sm text-slate-500 mt-1">Photos, videos, receipts, or documents help departments act faster.</p>
            <label className="mt-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-2xl py-12 cursor-pointer hover:border-[#1F4FD8] transition-colors">
              <input type="file" multiple className="hidden" onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])} />
              <Camera className="text-slate-400" size={26} />
              <span className="text-sm font-semibold text-slate-600">Click to upload files</span>
              <span className="text-xs text-slate-400">JPG, PNG, MP4, PDF up to 25MB</span>
            </label>
            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs bg-slate-100 rounded-full px-3 py-1.5"><Paperclip size={11} /> {f.name}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E]">Review and submit</h2>
            <p className="text-sm text-slate-500 mt-1">Confirm the details below before submitting your report.</p>
            <div className="mt-6 rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm">
              {[["Type", type && TYPE_META[type].label], ["Category", category], ["Title", title || "—"], ["Description", desc || "—"], ["Location", location || "—"], ["Priority", priority], ["Evidence", `${files.length} file(s) attached`]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-3.5">
                  <span className="text-slate-400 font-medium">{k}</span>
                  <span className="text-[#0A1B2E] font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 7 && submitted && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#EAFAEF] flex items-center justify-center mx-auto"><CheckCircle2 className="text-[#16A34A]" size={30} /></div>
            <h2 className="font-display text-xl font-semibold text-[#0A1B2E] mt-5">Report submitted</h2>
            <p className="text-sm text-slate-500 mt-1">Your reference number is</p>
            <div className="inline-block font-mono text-lg font-semibold text-[#1F4FD8] bg-[#1F4FD8]/10 rounded-xl px-5 py-2.5 mt-3">{submitted.id}</div>
            <div className="flex justify-center gap-3 mt-8">
              <button onClick={() => navigate("/reports")} className="px-5 py-3 rounded-full text-sm font-semibold border border-slate-300">Track your complaint</button>
              <button onClick={() => navigate("/dashboard")} className="px-5 py-3 rounded-full text-sm font-semibold bg-[#1F4FD8] text-white">Back to dashboard</button>
            </div>
          </div>
        )}

        {step <= TOTAL_STEPS && (
          <div className="flex justify-between mt-9">
            <button onClick={back} disabled={step === 1} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-500 disabled:opacity-0">
              <ChevronLeft size={15} /> Back
            </button>
            {step < TOTAL_STEPS ? (
              <button onClick={next} disabled={step === 1 && !type} className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1F4FD8] text-white disabled:opacity-40">
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={submit} className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold bg-[#16A34A] text-white">
                Submit report <Send size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
