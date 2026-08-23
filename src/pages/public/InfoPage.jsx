import React from "react";

// Generic content page used for About / Contact / Complaint-types info.
export function InfoPage({ title, body }) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
      <h1 className="font-display text-3xl font-semibold text-[#0A1B2E]">{title}</h1>
      <p className="text-slate-600 leading-relaxed mt-5">{body}</p>
    </div>
  );
}

export default function About() {
  return (
    <InfoPage
      title="About CivicPulse"
      body="CivicPulse is a prototype civic reporting platform built to demonstrate how Nigerian communities could report, track, and resolve local issues transparently. This build uses demo data only and is not connected to any government system."
    />
  );
}

export function Contact() {
  return (
    <InfoPage
      title="Contact"
      body="This is a prototype build, so this page is illustrative. In production, this would include support channels, partnership inquiries for government agencies, and a press contact."
    />
  );
}

export function ComplaintsInfo() {
  return (
    <InfoPage
      title="Complaint categories"
      body="CivicPulse routes three kinds of complaints — community issues, government services, and consumer or business complaints — to the right authority using demo classification logic that can be replaced with a live service in production."
    />
  );
}
