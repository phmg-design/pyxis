import React from "react";
import { Key, ShieldAlert, BadgeCheck, Users, ToggleLeft, ToggleRight, AlertTriangle, Sparkles, FolderOpen, RefreshCw, Layers } from "lucide-react";
import { designerProfiles, DesignerProfile } from "../data";
import { ReceiptEntry } from "../types";

interface SettingsProps {
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  onSimulateDistraction: (distractionText: string, penaltyHours: number) => void;
  status: { keyConfigured: boolean; model: string };
  receipts: ReceiptEntry[];
  onClearHistory: () => void;
}

export default function Settings({
  selectedProfileId,
  setSelectedProfileId,
  onSimulateDistraction,
  status,
  receipts,
  onClearHistory
}: SettingsProps) {
  const currentProfile = designerProfiles.find((p) => p.id === selectedProfileId) || designerProfiles[0];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pt-24 px-8 md:px-16 pb-36 max-w-4xl mx-auto w-full relative select-none">
      
      {/* Page Header */}
      <header className="mb-14 text-center">
        <h2 className="font-sans text-2xl font-bold text-stellar-white tracking-tight lowercase mb-1.5">
          arquivos & calibração
        </h2>
        <p className="font-mono text-xs text-mist-grey tracking-wide lowercase">
          ajustes de amostragem e histórico do instrumento
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 columns: Configs */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Specialty config */}
          <section className="hairline-border rounded-lg p-6 space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stellar-white flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-brass" />
              <span>perfil de calibração do designer</span>
            </h3>
            <p className="font-mono text-[11px] text-mist-grey leading-relaxed lowercase">
              especifica quais desvios e micro-comportamentos são comuns para o seu tipo de fluxo criativo. o pyxis customiza os questionamentos baseado nisso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {designerProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileId(p.id)}
                  className={`flex-1 font-mono text-[10px] uppercase tracking-wider border rounded px-4 py-3 text-center transition-all ${
                    selectedProfileId === p.id
                      ? "text-brass border-brass bg-brass/[0.02]"
                      : "text-mist-grey border-mist-grey/15 hover:border-stellar-white/30 hover:text-stellar-white"
                  }`}
                >
                  {p.name.replace("desenvolvimento criativo client-side", "dev frontend")}
                </button>
              ))}
            </div>

            {/* Profile specific behavior review */}
            <div className="bg-white/[0.01] p-4 rounded hairline-border font-mono text-xs space-y-3">
              <div>
                <span className="text-mist-grey text-[10px] uppercase block mb-1">especialidade</span>
                <span className="text-stellar-white lowercase font-medium">{currentProfile.specialty}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-mist-grey text-[10px] uppercase block mb-1.5 text-brass/70">fugas comuns</span>
                  <ul className="space-y-1 text-mist-grey text-[11px] list-disc list-inside">
                    {currentProfile.typicalDistractions.slice(0, 2).map((td, i) => (
                      <li key={i} className="truncate lowecase">{td}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-mist-grey text-[10px] uppercase block mb-1.5 opacity-70">foco esperado</span>
                  <ul className="space-y-1 text-mist-grey text-[11px] list-disc list-inside">
                    {currentProfile.typicalTasks.slice(0, 2).map((tt, i) => (
                      <li key={i} className="truncate lowercase">{tt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Passive Tracking Simulation */}
          <section className="hairline-border rounded-lg p-6 space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stellar-white flex items-center gap-2">
              <ToggleLeft className="w-4 h-4 text-brass" />
              <span>simulação de desvios da atmosfera</span>
            </h3>
            <p className="font-mono text-[11px] text-mist-grey leading-relaxed lowercase">
              forçe gatilhos passivos de distração para ver pyxis calibrar o log do dashboard e gerar confrontações instantâneas sob medida para sua fuga criativa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProfile.typicalDistractions.map((dist, idx) => (
                <button
                  key={idx}
                  onClick={() => onSimulateDistraction(dist, parseFloat((2 + idx * 0.5).toFixed(1)))}
                  className="relative group text-left px-4 py-3 border border-mist-grey/15 hover:border-brass/35 bg-white/[0.01] hover:bg-white/[0.02] rounded font-mono text-[11px] text-stellar-white/80 lowercase transition-all"
                >
                  <span className="block truncate pr-8">{dist}</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-brass opacity-60 group-hover:opacity-100 transition-opacity">
                    +{(2 + idx * 0.5).toFixed(1)}h
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Instrument Status / Credentials Guidance / Storage */}
        <div className="space-y-10">
          
          {/* API Credentials guidelines */}
          <section className="hairline-border rounded-lg p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stellar-white flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-brass" />
              <span>chave gemini</span>
            </h3>

            {status.keyConfigured ? (
              <div className="flex items-start gap-2.5 bg-green-950/20 p-3.5 rounded border border-green-900/30 font-mono text-[11px] text-green-200">
                <BadgeCheck className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                <div className="lowercase">
                  sistema conectado com sucesso. utilizando {status.model} para análise e raciocínio de procrastinação real-time.
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 bg-brass/5 p-3.5 rounded border border-brass/20 font-mono text-[11px] text-brass/90">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="lowercase leading-relaxed">
                  rodando em modo simulado. para habilitar inteligência real-time do gemini, adicione sua chave de api <strong className="text-stellar-white text-[10px] uppercase">GEMINI_API_KEY</strong> nas configurações secretos do painel do google ai studio.
                </div>
              </div>
            )}
          </section>

          {/* Activity Retention / Saved Receipts */}
          <section className="hairline-border rounded-lg p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-stellar-white flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 text-brass" />
              <span>retentores de registro</span>
            </h3>
            
            <p className="font-mono text-[11px] text-mist-grey leading-relaxed lowercase">
              atualmente há {receipts.length} recibos guardados na memória volátil operacional do navegador (localStorage).
            </p>

            <button
              onClick={onClearHistory}
              disabled={receipts.length === 0}
              className="w-full font-mono text-[9px] uppercase tracking-wider border border-red-500/20 text-red-400 hover:bg-red-500/5 disabled:opacity-30 rounded py-2 text-center transition-all focus:outline-none"
            >
              zerar todos os arquivos físicos
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
