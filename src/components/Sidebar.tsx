import React from "react";
import { Sparkles, Radio, Shield, Settings, Compass, Layers, Hourglass, Database, Key } from "lucide-react";
import { SystemStatus } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: SystemStatus;
  speechEnabled: boolean;
  setSpeechEnabled: (val: boolean) => void;
  selectedProfile: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  status,
  speechEnabled,
  setSpeechEnabled,
  selectedProfile
}: SidebarProps) {
  return (
    <aside className="w-64 fixed left-0 top-0 h-full bg-ink-black flex flex-col p-8 md:p-10 hairline-border-r select-none z-50">
      
      {/* Brand logo & Wordmark */}
      <div className="flex flex-col gap-1 mb-14">
        <div className="flex items-center gap-2.5">
          {/* Logo mark of three small stars joined by a thin line into a compass needle (one brass, two white) */}
          <svg
            className="w-8 h-8"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Compass line needle */}
            <line
              x1="20"
              y1="8"
              x2="20"
              y2="32"
              stroke="#7E8595"
              strokeWidth="0.75"
              strokeDasharray="1 1.5"
            />
            <line
              x1="20"
              y1="12"
              x2="20"
              y2="28"
              stroke="#ECEDF0"
              strokeWidth="0.5"
            />
            {/* Top star: White */}
            <path
              d="M20 6 L21.5 9.5 L25 10 L22 12 L22.5 15.5 L20 13.5 L17.5 15.5 L18 12 L15 10 L18.5 9.5 Z"
              fill="#ECEDF0"
              transform="scale(0.6) translate(13, 6)"
            />
            {/* Middle star: Brass/Amber */}
            <path
              d="M20 6 L21.5 9.5 L25 10 L22 12 L22.5 15.5 L20 13.5 L17.5 15.5 L18 12 L15 10 L18.5 9.5 Z"
              fill="#D6A45A"
              className="animate-compass-pulse"
              transform="scale(0.8) translate(10, 10)"
            />
            {/* Bottom star: White */}
            <path
              d="M20 6 L21.5 9.5 L25 10 L22 12 L22.5 15.5 L20 13.5 L17.5 15.5 L18 12 L15 10 L18.5 9.5 Z"
              fill="#ECEDF0"
              transform="scale(0.6) translate(13, 34)"
            />
            
            {/* Subtle compass coordinate lines */}
            <circle cx="20" cy="20" r="14" stroke="#7E8595" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />
          </svg>
          
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-[0.18em] text-stellar-white font-semibold">pyxis</span>
            <span className="text-[9px] font-mono text-mist-grey tracking-[0.06em] lowercase opacity-75">
              inteligência ambiente
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation tabs */}
      <nav className="flex flex-col space-y-6">
        <button
          onClick={() => setActiveTab("painel")}
          className={`font-mono text-xs text-left tracking-[0.08em] flex items-center gap-3 transition-colors py-1.5 focus:outline-none relative group ${
            activeTab === "painel"
              ? "text-stellar-white font-medium"
              : "text-mist-grey hover:text-stellar-white"
          }`}
        >
          {activeTab === "painel" && (
            <span className="absolute -left-4 w-1.5 h-1.5 bg-brass rounded-sm animate-compass-pulse" />
          )}
          <Layers className="w-3.5 h-3.5 stroke-[1.25]" />
          <span>painel</span>
        </button>

        <button
          onClick={() => setActiveTab("check-in")}
          className={`font-mono text-xs text-left tracking-[0.08em] flex items-center gap-3 transition-colors py-1.5 focus:outline-none relative group ${
            activeTab === "check-in"
              ? "text-brass font-medium"
              : "text-mist-grey hover:text-stellar-white"
          }`}
        >
          {activeTab === "check-in" && (
            <span className="absolute -left-4 w-1.5 h-1.5 bg-brass rounded-sm" />
          )}
          <Radio className="w-3.5 h-3.5 stroke-[1.25]" />
          <span>check-in</span>
        </button>

        <button
          onClick={() => setActiveTab("arquivos")}
          className={`font-mono text-xs text-left tracking-[0.08em] flex items-center gap-3 transition-colors py-1.5 focus:outline-none relative group ${
            activeTab === "arquivos"
              ? "text-stellar-white font-medium"
              : "text-mist-grey hover:text-stellar-white"
          }`}
        >
          {activeTab === "arquivos" && (
            <span className="absolute -left-4 w-1.5 h-1.5 bg-brass rounded-sm animate-compass-pulse" />
          )}
          <Settings className="w-3.5 h-3.5 stroke-[1.25]" />
          <span>arquivos / config</span>
        </button>
      </nav>

      {/* Context info / Specialty */}
      <div className="mt-8 pt-6 hairline-border-t">
        <span className="text-[9px] font-mono text-mist-grey tracking-[0.1em] block mb-2 uppercase opacity-40">
          perfil ativo
        </span>
        <span className="font-mono text-[10px] text-stellar-white lowercase tracking-wide block truncate">
          {selectedProfile === "ux_ui" ? "design de interface" : selectedProfile === "frontend" ? "engenharia criativa" : "branding & identidade"}
        </span>
      </div>

      {/* Connection Indicator / Live Status */}
      <div className="mt-auto pt-8">
        <div className="hairline-border-t pt-5 pb-5 flex flex-col gap-3">
          <div>
            <div className="text-[9px] font-mono text-mist-grey tracking-[0.15em] uppercase opacity-40 mb-2">
              status do instrumento
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brass opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brass"></span>
              </span>
              <span className="font-mono text-[10px] text-stellar-white lowercase">
                {status.listening ? "escutando passivamente" : "calibrado"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[9px] font-mono text-mist-grey block opacity-40">
              gemini intelligence
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1 h-1 rounded-full ${status.keyConfigured ? "bg-[#30A46C]" : "bg-brass"}`} />
              <span className="font-mono text-[9px] text-mist-grey tracking-tight lowercase">
                {status.keyConfigured ? "chave conectada" : "simulador local"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[9px] font-mono text-mist-grey tracking-wider mt-4 opacity-50">
          starlight_v2.4.0
        </div>
      </div>
    </aside>
  );
}
