import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, RefreshCw, Send, AlertCircle, Sparkles, CornerDownLeft } from "lucide-react";
import { ReceiptEntry } from "../types";

interface CheckInProps {
  activeReceiptEntry: ReceiptEntry;
  confrontationQuestion: string;
  loadingConfrontation: boolean;
  onRefreshConfrontation: () => void;
  onSubmitDefense: (defenseText: string) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (val: boolean) => void;
}

export default function CheckIn({
  activeReceiptEntry,
  confrontationQuestion,
  loadingConfrontation,
  onRefreshConfrontation,
  onSubmitDefense,
  speechEnabled,
  setSpeechEnabled
}: CheckInProps) {
  const [defenseInput, setDefenseInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceVolumeArr, setVoiceVolumeArr] = useState<number[]>(Array(48).fill(4));
  const recognitionRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  // Trigger web speech synthesis to speak confrontational question aloud
  useEffect(() => {
    if (speechEnabled && confrontationQuestion && !loadingConfrontation) {
      speakQuestion(confrontationQuestion);
    }
  }, [confrontationQuestion, speechEnabled, loadingConfrontation]);

  const speakQuestion = (text: string) => {
    if (!window.speechSynthesis) return;
    // Cancel prior sound
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    // Adjust pitch and rate to convey a flat, direct, precise instrument robotic assistant
    utterance.pitch = 0.85;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Waveform noise generator to create extreme high fidelity breathing or voice reaction
  useEffect(() => {
    audioIntervalRef.current = setInterval(() => {
      setVoiceVolumeArr((prev) => {
        return prev.map((vol, index) => {
          const time = Date.now() / 240;
          // Sine wave backdrop + noise
          const base = 4 + Math.sin(time + index * 0.15) * 3;
          const randomSpike = isRecording ? Math.random() * 20 : (Math.random() > 0.93 ? Math.random() * 12 : 0);
          return Math.max(3, base + randomSpike);
        });
      });
    }, 120);

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isRecording]);

  // Speech to Text initialization using window.webkitSpeechRecognition / SpeechRecognition
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não oferece suporte para reconhecimento de fala local. Digite seu álibi na caixa de texto.");
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "pt-BR";

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          setDefenseInput(text);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const handleDefenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (defenseInput.trim()) {
      onSubmitDefense(defenseInput.trim());
      setDefenseInput("");
    }
  };

  const activePromise = activeReceiptEntry.promises[0] || "trabalho profundo no layout";
  const activeReality = activeReceiptEntry.realities[0] || { text: "desvio de foco detectado", status: "warning" };
  const alignmentDerivation = activeReceiptEntry.alignmentDerivation || "+3.5 hrs";
  const promiseTimestamp = activeReceiptEntry.timestamp || "14:00";

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-24 px-8 md:px-16 pb-28 max-w-2xl mx-auto w-full z-10 select-none">
      
      {/* Receipts cardboard log box (Screenshot style) */}
      <div className="bg-[#111318] rounded-md hairline-border w-full py-8 px-8 sm:px-10 mb-10 relative">
        {/* Dash border details reminiscent of proof cards */}
        <div className="flex justify-between items-center border-b-[0.5px] border-mist-grey/20 pb-4 mb-5">
          <span className="font-mono text-[9px] text-mist-grey uppercase tracking-wider">
            auditoria_de_foco
          </span>
          <span className="font-mono text-[9px] text-mist-grey">
            {activeReceiptEntry.date}
          </span>
        </div>

        <div className="space-y-5 font-mono text-xs">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col">
              <span className="text-mist-grey text-[10px] uppercase mb-1 tracking-wider">
                prometido:
              </span>
              <span className="text-stellar-white lowercase text-sm">
                {activePromise}
              </span>
            </div>
            <span className="text-mist-grey text-[10px] shrink-0">{promiseTimestamp}</span>
          </div>

          <div className="border-b-[0.5px] border-dashed border-mist-grey/15 w-full"></div>

          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col">
              <span className="text-mist-grey text-[10px] uppercase mb-1 tracking-wider">
                status real:
              </span>
              <span className="text-brass font-medium lowercase text-sm">
                {activeReality.text}
              </span>
            </div>
            <span className="text-mist-grey text-[10px] shrink-0">auditor_log</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t-[0.5px] border-dashed border-mist-grey/20 flex justify-between items-center bg-white/[0.01] -mx-4 px-4 py-2 rounded">
          <span className="font-mono text-[9px] text-mist-grey uppercase tracking-widest">
            desvio_de_alinhamento
          </span>
          <span className="font-mono text-xs text-brass font-semibold tracking-wider">
            {alignmentDerivation}
          </span>
        </div>
      </div>

      {/* Main Confrontational Area */}
      <div className="text-center w-full mb-12">
        <div className="flex items-center justify-center gap-2.5 mb-1.5">
          <span className="text-[10px] font-mono text-mist-grey uppercase tracking-widest">
            pergunta do instrumento
          </span>
          <button
            onClick={onRefreshConfrontation}
            disabled={loadingConfrontation}
            title="Recalibrar pergunta"
            className="text-mist-grey hover:text-stellar-white disabled:opacity-40 transition-opacity"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[1.5] ${loadingConfrontation ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loadingConfrontation ? (
          <div className="h-20 flex items-center justify-center">
            <span className="font-mono text-xs text-mist-grey tracking-widest animate-pulse">
              pyxis está analisando desvio...
            </span>
          </div>
        ) : (
          <div className="min-h-16 flex flex-col items-center justify-center">
            <h1 className="font-sans text-xl sm:text-2xl font-semibold text-brass leading-relaxed tracking-tight max-w-lg mb-3">
              {confrontationQuestion || "por que você está evitando o layout?"}
            </h1>
            <p className="font-mono text-[10px] text-mist-grey tracking-[0.1em] uppercase opacity-75">
              pyxis está aguardando retorno
            </p>
          </div>
        )}
      </div>

      {/* Answer Form Panel */}
      <div className="w-full max-w-md bg-ink-black/20 pb-10">
        <form onSubmit={handleDefenseSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            {/* STT trigger button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute left-3.5 p-1.5 rounded-md transition-all ${
                isRecording
                  ? "text-red-400 bg-red-400/10 animate-pulse"
                  : "text-mist-grey hover:text-stellar-white"
              }`}
              title={isRecording ? "Parar de escutar" : "Falar explicação via microfone"}
            >
              <Mic className="w-4 h-4 stroke-[1.5]" />
            </button>

            <input
              type="text"
              value={defenseInput}
              onChange={(e) => setDefenseInput(e.target.value)}
              placeholder={isRecording ? "grave sua voz, pyxis está ouvindo..." : "digite sua explicação ou álibi..."}
              className="w-full bg-ink-black border-[0.5px] border-mist-grey/20 focus:border-brass/50 rounded-md py-3 pl-12 pr-12 font-mono text-xs text-stellar-white focus:outline-none focus:ring-0 placeholder:text-mist-grey/30"
            />

            <button
              type="submit"
              disabled={!defenseInput.trim()}
              className={`absolute right-3.5 p-1.5 rounded-md transition-all ${
                defenseInput.trim()
                  ? "text-brass hover:bg-brass/10"
                  : "text-mist-grey/20"
              }`}
            >
              <CornerDownLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
            {/* Left side: Voice speech engine configuration */}
            <button
              type="button"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="flex items-center gap-1.5 font-mono text-[9px] text-mist-grey hover:text-stellar-white transition-colors"
            >
              {speechEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-brass" />
                  <span className="text-brass">vocalizador ativo (pt-br)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="opacity-60">vocalizador mutado</span>
                </>
              )}
            </button>

            <span className="font-mono text-[9px] text-mist-grey/40">
              * microfone/fala requer validação
            </span>
          </div>
        </form>
      </div>

      {/* Waveform graphic at the bottom */}
      <div className="fixed bottom-12 left-0 right-0 md:left-64 flex flex-col items-center">
        <div className="flex items-end h-8 gap-[2px] mb-3 p-1">
          {voiceVolumeArr.map((vol, i) => (
            <div
              key={i}
              className="w-[1.5px] rounded-full transition-all duration-75"
              style={{
                height: `${vol}px`,
                backgroundColor: isRecording ? "#EF4444" : vol > 12 ? "#ECEDF0" : "#D6A45A",
                opacity: isRecording ? 1 : vol > 10 ? 0.95 : 0.45
              }}
            />
          ))}
        </div>
        <div className="w-14 h-[0.5px] bg-brass/30"></div>
      </div>
    </div>
  );
}
