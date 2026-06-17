import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, Mic, Star, Sparkles, Send } from "lucide-react";
import { ReceiptEntry } from "../types";

interface DashboardProps {
  receipts: ReceiptEntry[];
  onAddIntent: (text: string) => void;
  onSimulateSpeech: () => void;
  loadingSpeech: boolean;
  onRunConfrontation: () => void;
}

export default function Dashboard({
  receipts,
  onAddIntent,
  onSimulateSpeech,
  loadingSpeech,
  onRunConfrontation
}: DashboardProps) {
  const [newIntent, setNewIntent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIntent.trim()) {
      onAddIntent(newIntent.trim());
      setNewIntent("");
    }
  };

  // Group receipts by date just for display elegance
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pt-24 px-8 md:px-16 pb-36 max-w-4xl mx-auto w-full relative">
      
      {/* Page Header */}
      <header className="mb-14 text-center">
        <h2 className="font-sans text-2xl font-bold text-stellar-white tracking-tight lowercase mb-1.5">
          registros de atividade
        </h2>
        <p className="font-mono text-xs text-mist-grey tracking-wide lowercase">
          monitorando atmosfera local e intenção
        </p>
      </header>

      {/* Chronological Logs Feed */}
      <div className="space-y-4">
        {receipts.map((entry, idx) => (
          <section
            key={entry.id || idx}
            className="hairline-border rounded-lg p-6 hover:bg-[#ECEDF0]/[0.015] transition-all group"
          >
            {/* Timestamp status line */}
            <div className="flex justify-between items-baseline mb-5">
              <span className="font-mono text-xs text-mist-grey tracking-wider">
                {entry.timestamp} — {entry.date}
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-sm ${
                entry.type === "verified"
                  ? "text-stellar-white border-stellar-white/20"
                  : entry.type === "ambient_log"
                  ? "text-mist-grey border-mist-grey/25"
                  : "text-brass border-brass/25"
              }`}>
                {entry.type}
              </span>
            </div>

            {/* Split Details: Promises vs Realities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Promises Column */}
              <div>
                <p className="font-mono text-[9px] uppercase text-mist-grey tracking-[0.1em] mb-3 opacity-60">
                  promessas
                </p>
                <ul className="space-y-3 font-mono text-xs text-stellar-white">
                  {entry.promises.map((promise, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="opacity-30 select-none font-sans">—</span>
                      <span className="leading-relaxed lowercase">{promise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reality Column */}
              <div>
                <p className="font-mono text-[9px] uppercase text-mist-grey tracking-[0.1em] mb-3 opacity-60">
                  realidade
                </p>
                <ul className="space-y-3 font-mono text-xs text-mist-grey">
                  {entry.realities.map((reality, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2.5 ${
                        reality.status === "warning" ? "text-brass/90" : ""
                      }`}
                    >
                      {reality.status === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-brass stroke-[1.5] mt-0.5 shrink-0" />
                      ) : reality.status === "warning" ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-brass stroke-[1.5] mt-0.5 shrink-0" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-mist-grey/50 stroke-[1.5] mt-0.5 shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className={`leading-relaxed lowercase ${reality.status === "success" ? "text-stellar-white/80" : ""}`}>
                          {reality.text}
                        </span>
                        {reality.sub && (
                          <span className="text-[10px] opacity-40 lowercase mt-0.5">
                            * {reality.sub}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Aesthetic Spacer/Footnote */}
      <footer className="mt-20 pb-10 flex flex-col items-center gap-4">
        <div className="h-[0.5px] w-12 bg-mist-grey/20"></div>
        <p className="font-mono text-[9px] text-mist-grey/40 lowercase tracking-widest">
          fim dos registros acumulados
        </p>
      </footer>

      {/* Floating Bottom Active Input Area (Fixed) */}
      <div className="fixed bottom-8 left-64 right-0 flex justify-center px-10 pointer-events-none z-40">
        <div className="w-full max-w-lg bg-ink-black/80 backdrop-blur-md px-1 py-1 rounded-lg hairline-border shadow-[0_4px_30px_rgba(0,0,0,0.8)] pointer-events-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            {/* Mic Button to simulate speech/voice check in */}
            <button
              type="button"
              onClick={onSimulateSpeech}
              title="Simular escuta de fala ambiente"
              className={`p-3 shrink-0 rounded-md transition-all focus:outline-none ${
                loadingSpeech
                  ? "text-brass bg-brass/10 animate-pulse"
                  : "text-mist-grey hover:text-stellar-white hover:bg-white/[0.04]"
              }`}
            >
              <Mic className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Main Intention Input */}
            <input
              type="text"
              value={newIntent}
              onChange={(e) => setNewIntent(e.target.value)}
              placeholder="declarar nova intenção..."
              className="w-full bg-transparent border-0 font-mono text-xs py-3 px-2 text-stellar-white placeholder:text-mist-grey/30 focus:ring-0 focus:outline-none"
            />

            {/* Submit Icon */}
            <div className="flex items-center gap-2 pr-3">
              <span className="font-mono text-[9px] text-mist-grey/30 hidden sm:inline select-none">
                enter
              </span>
              <button
                type="submit"
                disabled={!newIntent.trim()}
                className={`p-1.5 rounded-md transition-all ${
                  newIntent.trim()
                    ? "text-brass hover:bg-brass/5"
                    : "text-mist-grey/25"
                }`}
              >
                <Send className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
