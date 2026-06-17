import React, { useState, useEffect } from "react";
import { Compass, Sparkles, FolderSync, HelpCircle, XCircle, Info } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CheckIn from "./components/CheckIn";
import Settings from "./components/Settings";
import { initialReceipts, designerProfiles } from "./data";
import { ReceiptEntry, SystemStatus, RealityItem } from "./types";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>("painel");

  // State
  const [selectedProfileId, setSelectedProfileId] = useState<string>("ux_ui");
  const [receipts, setReceipts] = useState<ReceiptEntry[]>([]);
  const [activeReceiptEntry, setActiveReceiptEntry] = useState<ReceiptEntry | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [confrontationQuestion, setConfrontationQuestion] = useState<string>("");
  const [loadingConfrontation, setLoadingConfrontation] = useState<boolean>(false);
  const [loadingSpeech, setLoadingSpeech] = useState<boolean>(false);
  const [status, setStatus] = useState<SystemStatus>({
    online: true,
    model: "gemini-2.5-flash",
    listening: true,
    keyConfigured: false
  });

  // Load from localStorage or initial mock data
  useEffect(() => {
    const savedReceipts = localStorage.getItem("pyxis_receipts");
    if (savedReceipts) {
      try {
        const parsed = JSON.parse(savedReceipts);
        setReceipts(parsed);
        if (parsed.length > 0) {
          // Default active is the last warning or most recent
          const latestWarning = [...parsed].reverse().find(r => r.realities.some(real => real.status === "warning"));
          setActiveReceiptEntry(latestWarning || parsed[parsed.length - 1]);
        }
      } catch (e) {
        setReceipts(initialReceipts);
        setActiveReceiptEntry(initialReceipts[3]);
      }
    } else {
      setReceipts(initialReceipts);
      setActiveReceiptEntry(initialReceipts[3]);
      localStorage.setItem("pyxis_receipts", JSON.stringify(initialReceipts));
    }

    const savedProfile = localStorage.getItem("pyxis_active_profile");
    if (savedProfile) {
      setSelectedProfileId(savedProfile);
    }
  }, []);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem("pyxis_active_profile", selectedProfileId);
  }, [selectedProfileId]);

  // Fetch API key status from express backend
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.keyConfigured === "boolean") {
          setStatus({
            online: true,
            model: "gemini-2.5-flash",
            listening: true,
            keyConfigured: data.keyConfigured
          });
        }
      })
      .catch((err) => {
        console.warn("Backend status endpoint unreached, running mock proxy safely.");
      });
  }, []);

  // Helper: Get Current Hex Timestamps matching receipts aesthetic
  const getFormattedTimestamp = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // direct 12 formatting
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds}_${ampm}`;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const months = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    return `${now.getDate()}_${months[now.getMonth()]}_${now.getFullYear()}`;
  };

  // Helper: Update state & localStorage simultaneously
  const updateReceipts = (updated: ReceiptEntry[]) => {
    setReceipts(updated);
    localStorage.setItem("pyxis_receipts", JSON.stringify(updated));
  };

  // Action: Add new manually typed Promise target
  const handleAddIntent = (intentText: string) => {
    const freshEntry: ReceiptEntry = {
      id: `manual_${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      date: getFormattedDate(),
      type: "ambient_log",
      promises: [intentText.startsWith("vou ") ? intentText : `vou ${intentText}`],
      realities: [
        { text: "escutando atmosfera de tarefas...", status: "pending" }
      ],
      alignmentDerivation: "0.0 hrs"
    };

    const nextReceipts = [...receipts, freshEntry];
    updateReceipts(nextReceipts);
    setActiveReceiptEntry(freshEntry);
  };

  // Action: Simulate speech passive microphone listening
  const handleSimulateSpeech = async () => {
    setLoadingSpeech(true);
    
    // Choose randomized spoken targets based on Specialty Profile
    const profile = designerProfiles.find(p => p.id === selectedProfileId) || designerProfiles[0];
    const randomIndex = Math.floor(Math.random() * profile.typicalTasks.length);
    const mockSpeech = `olha, eu decidi que vou ${profile.typicalTasks[randomIndex]}`;

    try {
      const res = await fetch("/api/parse-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speech: mockSpeech })
      });
      const data = await res.json();
      
      const parsedPromise = data.promise || `finalizar ${profile.typicalTasks[randomIndex]}`;
      const freshEntry: ReceiptEntry = {
        id: `speech_${Date.now()}`,
        timestamp: getFormattedTimestamp(),
        date: getFormattedDate(),
        type: "verified",
        promises: [parsedPromise],
        realities: [
          { text: "calibrado em escuta passiva.", status: "success" }
        ],
        alignmentDerivation: "0.0 hrs"
      };

      const nextReceipts = [...receipts, freshEntry];
      updateReceipts(nextReceipts);
      setActiveReceiptEntry(freshEntry);
    } catch (e) {
      console.error("Failed to parse simulated speech:", e);
    } finally {
      setLoadingSpeech(false);
    }
  };

  // Action: Simulate a background distraction detected
  const handleSimulateDistraction = (distractionText: string, penaltyHours: number) => {
    // Collect active specialty profile
    const profile = designerProfiles.find(p => p.id === selectedProfileId) || designerProfiles[0];
    
    // Take the last declared promise or choose one matching profile
    const currentPromise = receipts.length > 0 
      ? receipts[receipts.length - 1].promises[0] 
      : profile.typicalTasks[0];

    const freshEntry: ReceiptEntry = {
      id: `distract_${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      date: getFormattedDate(),
      type: "daily_close",
      promises: [currentPromise],
      realities: [
        { text: distractionText, status: "warning" }
      ],
      alignmentDerivation: `+${penaltyHours} hrs`
    };

    const nextReceipts = [...receipts, freshEntry];
    updateReceipts(nextReceipts);
    setActiveReceiptEntry(freshEntry);

    // Call Gemini API immediately to fetch tailored confrontational response
    fetchConfrontation(freshEntry);
    
    // Switch to active check-in layout!
    setActiveTab("check-in");
  };

  // Action: Query Gemini and set the confrontational question
  const fetchConfrontation = async (entry: ReceiptEntry) => {
    setLoadingConfrontation(true);
    setConfrontationQuestion("");
    
    const profile = designerProfiles.find(p => p.id === selectedProfileId) || designerProfiles[0];

    try {
      const res = await fetch("/api/confront", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promises: entry.promises,
          realities: entry.realities,
          profile: profile.specialty
        })
      });
      const data = await res.json();
      
      if (data && data.question) {
        setConfrontationQuestion(data.question);
      } else {
        setConfrontationQuestion("por que você está evitando o layout?");
      }
    } catch (err) {
      console.error("Error loading confrontation:", err);
      setConfrontationQuestion("por que você está evitando o layout?");
    } finally {
      setLoadingConfrontation(false);
    }
  };

  // Action: User submits álibi explanation
  const handleSubmitDefense = (defenseText: string) => {
    if (!activeReceiptEntry) return;

    // Acknowledge explanation & resolve drift
    const updatedRealities: RealityItem[] = [
      ...activeReceiptEntry.realities.map(r => ({
        ...r,
        status: "success" as const // mark audit cleared!
      })),
      {
        text: `álibi arquivado: "${defenseText}"`,
        status: "success" as const
      }
    ];

    const updatedEntry: ReceiptEntry = {
      ...activeReceiptEntry,
      realities: updatedRealities,
      alignmentDerivation: "0.0 hrs", // alignment calibrating
      justification: defenseText
    };

    const nextReceipts = receipts.map(r => r.id === activeReceiptEntry.id ? updatedEntry : r);
    updateReceipts(nextReceipts);
    setActiveReceiptEntry(updatedEntry);

    // Provide friendly success robot confirmation
    if (speechEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("álibi registrado. calibrando bússola de foco.");
      utterance.lang = "pt-BR";
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }

    // Slide back into Dashboard view safely
    setTimeout(() => {
      setActiveTab("painel");
    }, 1200);
  };

  // Action: Recalibrate question manually
  const handleRefreshConfrontation = () => {
    if (activeReceiptEntry) {
      fetchConfrontation(activeReceiptEntry);
    }
  };

  // Initial loading trigger
  useEffect(() => {
    if (activeReceiptEntry && activeReceiptEntry.realities.some(r => r.status === "warning") && !confrontationQuestion) {
      fetchConfrontation(activeReceiptEntry);
    }
  }, [activeReceiptEntry]);

  // Clean local files
  const handleClearHistory = () => {
    localStorage.removeItem("pyxis_receipts");
    setReceipts([]);
    setActiveReceiptEntry(null);
    setConfrontationQuestion("por que você está evitando o layout?");
  };

  return (
    <div className="flex h-screen bg-ink-black text-stellar-white overflow-hidden relative font-sans">
      
      {/* Background celestial compass star (ambient design) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center opacity-[0.0125]">
        <svg viewBox="0 0 400 400" className="w-[85%] max-w-[500px]">
          <line x1="200" y1="0" x2="200" y2="400" stroke="#ECEDF0" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#ECEDF0" strokeWidth="1" />
          <circle cx="200" cy="200" r="120" stroke="#ECEDF0" strokeWidth="0.5" strokeDasharray="3 4" />
          <circle cx="200" cy="200" r="180" stroke="#ECEDF0" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Side Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        selectedProfile={selectedProfileId}
      />

      {/* Main Container Stage */}
      <main className="ml-64 flex-1 h-full flex flex-col relative bg-transparent overflow-hidden">
        
        {/* Top Header Panel */}
        <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-10 md:px-14 bg-ink-black/80 backdrop-blur-md z-45 hairline-border-b select-none">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-stellar-white font-medium capitalize tracking-wider">
              {activeTab === "painel" ? "painel auditório" : activeTab === "check-in" ? "check-in ativo" : "instrumento arquivos"}
            </span>
            <div className="w-[1px] h-3 bg-mist-grey/25"></div>
            <span className="font-mono text-[9px] text-mist-grey">
              pyxis_starlight_ops
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[10px] text-stellar-white font-semibold">phmg@cesar.school</span>
              <span className="text-[8px] font-mono text-mist-grey tracking-wider">designer sênior</span>
            </div>
            
            {/* Minimalist technical avatar outline */}
            <div className="w-7 h-7 rounded-md border-[0.5px] border-mist-grey/30 flex items-center justify-center p-0.5 overflow-hidden">
              <div className="w-full h-full bg-mist-grey/15 rounded-sm flex items-center justify-center font-mono text-[10px] text-brass font-bold select-none">
                ph
              </div>
            </div>
          </div>
        </header>

        {/* Modular View Router */}
        {activeTab === "painel" ? (
          <Dashboard
            receipts={receipts}
            onAddIntent={handleAddIntent}
            onSimulateSpeech={handleSimulateSpeech}
            loadingSpeech={loadingSpeech}
            onRunConfrontation={() => setActiveTab("check-in")}
          />
        ) : activeTab === "check-in" ? (
          <CheckIn
            activeReceiptEntry={activeReceiptEntry || receipts[3] || receipts[0]}
            confrontationQuestion={confrontationQuestion}
            loadingConfrontation={loadingConfrontation}
            onRefreshConfrontation={handleRefreshConfrontation}
            onSubmitDefense={handleSubmitDefense}
            speechEnabled={speechEnabled}
            setSpeechEnabled={setSpeechEnabled}
          />
        ) : (
          <Settings
            selectedProfileId={selectedProfileId}
            setSelectedProfileId={setSelectedProfileId}
            onSimulateDistraction={handleSimulateDistraction}
            status={status}
            receipts={receipts}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>
    </div>
  );
}
