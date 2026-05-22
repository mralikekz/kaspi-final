import React, { useEffect, useState } from "react";
import { Coins, ShieldAlert, BadgeCheck, Sparkles, Loader2, ArrowRight, Terminal, Trash2, RefreshCw } from "lucide-react";
import { KaspiLang } from "../types";
import { getTranslation } from "../utils/translations";

declare global {
  interface Window {
    Pi?: any;
  }
}

interface PiPaymentTestingProps {
  lang: KaspiLang;
}

export default function PiPaymentTesting({ lang }: PiPaymentTestingProps) {
  const [piUser, setPiUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [txid, setTxid] = useState<string>("");
  const [amount, setAmount] = useState<number>(0.1);
  const [sdkStatus, setSdkStatus] = useState<"not_detected" | "detected" | "authenticating" | "authenticated" | "error">("not_detected");
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; type: "info" | "success" | "error" | "pending" }>>([]);
  const [serverConfig, setServerConfig] = useState<{ hasApiKey: boolean; hasValidationKey: boolean } | null>(null);
  const [serverLogs, setServerLogs] = useState<Array<{ id: string; timestamp: string; endpoint: string; paymentId: string; txid?: string; level: "success" | "info" | "error"; message: string; data?: any }>>([]);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const addLog = (msg: string, type: "info" | "success" | "error" | "pending" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, time, msg, type }]);
  };

  useEffect(() => {
    const fetchServerLogs = () => {
      fetch("/api/pi/logs")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setServerLogs(data);
          }
        })
        .catch(err => {
          console.warn("Could not retrieve server-side Pi logs:", err);
        });
    };

    fetchServerLogs();
    const interval = setInterval(fetchServerLogs, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleClearServerLogs = async () => {
    try {
      await fetch("/api/pi/logs/clear", { method: "POST" });
      setServerLogs([]);
      setSelectedLogId(null);
    } catch (err) {
      console.error("Failed to clear server logs:", err);
    }
  };

  useEffect(() => {
    // Audit backend key configurations
    fetch("/api/pi/status")
      .then(res => res.json())
      .then(data => {
        setServerConfig(data);
        if (!data.hasApiKey) {
          addLog("⚠️ SERVER WARNING: PI_API_KEY is not defined in backend secrets! Real transactions will fail with 'Payment Expired'. Please supply your key to continue.", "error");
        } else {
          addLog("✅ Verified: Server backend has official PI_API_KEY configured and ready.", "success");
        }
      })
      .catch(err => {
        console.warn("Could not retrieve server Pi configuration status:", err);
      });

    if (typeof window !== "undefined") {
      // Small timeout to let script tag fully resolve in Pi Browser sandboxes
      const timer = setTimeout(() => {
        if (window.Pi) {
          try {
            window.Pi.init({ version: "2.0", sandbox: true });
            setSdkStatus("detected");
            addLog("Pi Network JS SDK loaded successfully and sandboxed handshake established.", "success");
          } catch (err: any) {
            console.error("Pi SDK init failed:", err);
            setSdkStatus("error");
            addLog(`Pi SDK initiation error: ${err.message || err}`, "error");
          }
        } else {
          setSdkStatus("not_detected");
          addLog("Pi Network sandbox not found. Ready to use simulation bypass or active Pi Browser environment.", "info");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePiAuthentication = async () => {
    if (!window.Pi) {
      addLog("Authentication simulated. Open app in real Pi Browser to obtain official Pioneer security context.", "info");
      setPiUser({ username: "PioneerTestUser", uid: "pi-sandbox-user-12345" });
      setSdkStatus("authenticated");
      return;
    }

    setSdkStatus("authenticating");
    addLog("Requesting authentication signature with Pi core node...", "pending");

    try {
      const scopes = ["username", "payments"];
      
      // Incomplete payment recovery callback matching standard specification
      const onIncompletePaymentFound = async (payment: any) => {
        addLog(`Found incomplete/unsettled payment matching ID: ${payment.identifier}. Attempting recovery completed state...`, "pending");
        await handlePaymentCompletion(payment.identifier, payment.transaction?.txid || "recovered");
      };

      const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      setPiUser(auth.user);
      setSdkStatus("authenticated");
      addLog(`Authenticated successfully! Pioneer Username: @${auth.user.username}`, "success");
    } catch (err: any) {
      console.error(err);
      setSdkStatus("error");
      addLog(`Authentication handshake rejected: ${err.message || err}`, "error");
    }
  };

  const handlePaymentCompletion = async (payId: string, transactionId: string) => {
    addLog(`Confirming ledger tx on blockchain. Hash: ${transactionId}. Submitting server-side validation...`, "pending");
    try {
      const res = await fetch("/api/pi/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payId, txid: transactionId, isSandboxSimulation: !window.Pi })
      });
      const data = await res.json();
      if (data.success) {
        setTxid(transactionId);
        addLog("🎉 PERFECT! Core Pi Core API validated and finalized payment! Step 10 completed!", "success");
        setStatusMessage("validated");
      } else {
        const detailStr = data.details ? (typeof data.details === "object" ? JSON.stringify(data.details) : data.details) : "";
        addLog(`Ledger finalization failed: ${data.error || "Verification issue"}. ${data.message || ""} ${detailStr}`, "error");
        setStatusMessage("error");
      }
    } catch (err: any) {
      addLog(`Completion failed: ${err.message}`, "error");
      setStatusMessage("error");
    }
  };

  const handleTriggerPayment = async () => {
    if (amount <= 0) {
      addLog("Invalid Pi amount provided.", "error");
      return;
    }

    setStatusMessage("initiating");
    addLog(`Creating user-to-app payment intent for ${amount} PI...`, "pending");

    if (!window.Pi) {
      addLog("Simulating Pi Payment Flow outside of the Pi Browser environment...", "info");
      
      // Simulated sandbox interval sequence
      setTimeout(() => {
        const mockPayId = `MOCK_PAY_ID_${Math.floor(Math.random() * 90000) + 10000}`;
        setPaymentId(mockPayId);
        addLog(`[MOCK] Payment ID created: ${mockPayId}. Approving on server...`, "pending");
        
        setTimeout(async () => {
          try {
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: mockPayId, isSandboxSimulation: true })
            });
            const result = await res.json();
            if (result.success) {
              addLog(`[MOCK] Approved success! Broadcasting to testnet block explorer...`, "pending");
              
              setTimeout(() => {
                const mockTx = `MOCK_TX_HASH_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
                handlePaymentCompletion(mockPayId, mockTx);
              }, 1200);
            } else {
              addLog(`[MOCK] Server validation failed: ${result.error}`, "error");
              setStatusMessage("error");
            }
          } catch (e: any) {
            addLog(`[MOCK] Web server offline: ${e.message}`, "error");
            setStatusMessage("error");
          }
        }, 1200);
      }, 1000);
      return;
    }

    try {
      // Standard direct execution path
      window.Pi.createPayment({
        amount: amount,
        memo: `Verification payment for Dev Portal Step 10 - KASPI Portal`,
        metadata: { orderId: `KASPI_PAY_P10_${Date.now()}` }
      }, {
        onReadyForServerApproval: async (payId: string) => {
          setPaymentId(payId);
          addLog(`Payment successfully created. ID: ${payId}. Requesting server approval...`, "pending");
          
          try {
            const res = await fetch("/api/pi/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: payId, isSandboxSimulation: false })
            });
            const result = await res.json();
            if (result.success) {
              addLog("Payment approved by server! Prompting Pioneer blockchain transaction signing...", "success");
            } else {
              const detailStr = result.details ? (typeof result.details === "object" ? JSON.stringify(result.details) : result.details) : "";
              addLog(`Pi Core API server approval failed: ${result.error || "Unknown error"}. ${result.message || ""} ${detailStr}`, "error");
              setStatusMessage("error");
            }
          } catch (err: any) {
            addLog(`Approval transmission error: ${err.message}`, "error");
            setStatusMessage("error");
          }
        },
        onReadyForServerCompletion: async (payId: string, blockchainTxId: string) => {
          await handlePaymentCompletion(payId, blockchainTxId);
        },
        onCancel: (payId: string) => {
          addLog(`Payment cancelled by Pioneer. Payment ID: ${payId}`, "error");
          setStatusMessage("error");
        },
        onError: (err: any, payId: string) => {
          addLog(`Blockchain Core error: ${err.message || err}`, "error");
          setStatusMessage("error");
        }
      });
    } catch (err: any) {
      addLog(`Unexpected payment exception: ${err.message || err}`, "error");
      setStatusMessage("error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs dark:bg-zinc-900 dark:border-zinc-805 transition-all">
      <div className="flex flex-col md:flex-row items-start justify-between gap-5">
        
        {/* Detail Info Block */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center dark:bg-purple-950/40">
              <Coins className="h-4.5 w-4.5 text-purple-650 dark:text-purple-400" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-sans">
              {getTranslation("piTestTitle", lang)}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-medium">
            {getTranslation("piTestDesc", lang)}
          </p>

          {serverConfig && !serverConfig.hasApiKey && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-extrabold text-sm uppercase tracking-wider text-amber-950 dark:text-amber-200">
                    {lang === "RU" ? "PI_API_KEY не обнаружен!" : "PI_API_KEY Missing!"}
                  </p>
                  <p className="leading-relaxed text-slate-650 dark:text-zinc-350 font-sans font-medium">
                    {lang === "RU" 
                      ? "Блокчейн Pi требует обязательного серверного подтверждения (Server-to-Server). Без настроенного Server API Key плата в Pi Browser ВСЕГДА будет зависать и выдавать ошибку 'Payment Expired!' в кошельке." 
                      : "The Pi blockchain requires secure serverside validation. Without your Server API Key, live transactions inside the Pi Browser will ALWAYS time out and fail with 'Payment Expired!' inside the wallet."}
                  </p>
                  <div className="pt-2 text-[10.5px]">
                    <p className="font-black text-amber-950 dark:text-amber-100 uppercase tracking-widest text-[9.5px] mb-1">
                      {lang === "RU" ? "Инструкция по настройке:" : "Configuration Guide:"}
                    </p>
                    <ol className="list-decimal pl-4.5 space-y-1 text-slate-600 dark:text-zinc-400 font-mono font-medium">
                      <li>{lang === "RU" ? "Перейдите в Pi Developer Portal (develop.pi в Pi Browser) и откройте Ваше приложение." : "Go to Pi Developer Portal (develop.pi in the Pi Browser) and open your app config."}</li>
                      <li>{lang === "RU" ? "Сгенерируйте и скопируйте 'Server API Key'." : "Generate and copy your developer 'Server API Key'."}</li>
                      <li>{lang === "RU" ? "Добавьте этот ключ как переменную окружения PI_API_KEY (в Secrets панели AI Studio или в панели Vercel)." : "Add it as environment variable 'PI_API_KEY' (in AI Studio Secrets panel, or Vercel Environment Variables)."}</li>
                      <li>{lang === "RU" ? "Перезапустите или обновите сервер, чтобы применить ключ." : "Redeploy or restart your app server."}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preset Buttons & Custom input */}
          <div className="pt-2 flex flex-wrap gap-2 items-center">
            {[0.1, 1, 5, 10].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-extrabold border transition-all cursor-pointer ${
                  amount === preset
                    ? "bg-purple-650 text-white border-purple-600 dark:bg-purple-700"
                    : "bg-slate-50/50 hover:bg-slate-100 dark:bg-zinc-800 dark:border-zinc-700 text-slate-600 dark:text-zinc-300"
                }`}
              >
                {preset.toFixed(1)} PI
              </button>
            ))}

            <div className="relative rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-150 dark:border-zinc-700 px-2.5 py-1.5 flex items-center gap-1.5 max-w-[130px]">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-none text-xs font-mono font-bold focus:outline-hidden text-right dark:text-white"
                placeholder="Custom"
              />
              <span className="text-[10px] font-extrabold text-slate-450 uppercase font-mono">PI</span>
            </div>
          </div>

          {/* Connect & Pay Trigger Buttons */}
          <div className="pt-3 flex flex-wrap gap-3 items-center">
            {sdkStatus !== "authenticated" ? (
              <button
                onClick={handlePiAuthentication}
                disabled={sdkStatus === "authenticating"}
                className="bg-black hover:bg-slate-900 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl text-xs font-extrabold tracking-tight flex items-center gap-2 cursor-pointer transition-all shadow-md shrink-0"
              >
                {sdkStatus === "authenticating" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                )}
                {getTranslation("btnAuth", lang)}
              </button>
            ) : (
              <button
                onClick={handleTriggerPayment}
                disabled={statusMessage === "initiating"}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-105 duration-200 text-white px-5 py-2 rounded-xl text-xs font-black tracking-tight flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
              >
                {statusMessage === "initiating" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Coins className="h-3.5 w-3.5 text-amber-100" />
                )}
                {getTranslation("btnPay", lang).replace("{amount}", String(amount))}
                <ArrowRight className="h-3 w-3" />
              </button>
            )}

            {/* Connection Status Label */}
            <div className="flex items-center gap-1.5 py-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                sdkStatus === "authenticated" ? "bg-emerald-500 animate-pulse" :
                sdkStatus === "detected" ? "bg-amber-400 animate-pulse" :
                sdkStatus === "authenticating" ? "bg-blue-400 animate-pulse" :
                "bg-slate-350 dark:bg-zinc-650"
              }`} />
              <span className="text-[10px] font-bold text-slate-450 dark:text-zinc-500 font-sans uppercase tracking-widest">
                {sdkStatus === "authenticated" ? `Connected as @${piUser?.username || "Pioneer"}` :
                 sdkStatus === "detected" ? "Pi Browser Detected" :
                 sdkStatus === "authenticating" ? "Authorizing..." :
                 "Offline Simulator Mode"}
              </span>
            </div>
          </div>

        </div>

        {/* Live Processing Action Console Log */}
        <div className="w-full md:w-80 flex flex-col h-44 border border-slate-150 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950 overflow-hidden shrink-0">
          <div className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-150 px-3 py-1.5 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-mono">
              Pi Verification Ledger Status
            </span>
            <span className="text-[8px] font-mono bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 py-0.5 px-1.5 rounded-md font-bold uppercase">
              Live Feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 font-mono text-[9px] leading-relaxed scrollbar-thin scrollbar-thumb-rounded">
            {logs.length === 0 ? (
              <p className="text-slate-400 dark:text-zinc-600 italic">No operations recorded yet. Press button to trigger event.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`flex items-start gap-1.5 ${
                  log.type === "success" ? "text-emerald-600 dark:text-emerald-400" :
                  log.type === "error" ? "text-rose-600 dark:text-rose-400" :
                  log.type === "pending" ? "text-amber-500 dark:text-yellow-400" :
                  "text-slate-500 dark:text-zinc-400"
                }`}>
                  <span className="text-[8px] text-slate-400 mt-0.5 shrink-0">{log.time}</span>
                  <p className="font-bold">{log.msg}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Expanded diagnostic block of actual Server-to-Server Gateway handshake API logs */}
      <div className="mt-5 border-t border-slate-150 dark:border-zinc-800 pt-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-purple-50 flex items-center justify-center dark:bg-purple-950/20">
              <Terminal className="h-3.5 w-3.5 text-purple-650 dark:text-purple-400" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-sans">
              {lang === "RU" ? "Диагностика API Рукопожатий (В реальном времени)" : "Blockchain API Handshake Logs (Real-Time)"}
            </h4>
          </div>
          
          {serverLogs.length > 0 && (
            <button 
              onClick={handleClearServerLogs}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 border border-slate-150 hover:bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-zinc-800/40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-850 cursor-pointer transition-all font-mono"
            >
              <Trash2 className="h-3 w-3" />
              {lang === "RU" ? "Очистить" : "Clear"}
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3 font-medium">
          {lang === "RU" 
            ? "Здесь отображаются реальные логи обмена данными между Вашим сервером и официальными серверами Pi Network. Нажмите на лог, чтобы увидеть подробный JSON-ответ (помогает выявить недействительный API-ключ или истекший сеанс)."
            : "This monitors communication between your backend and the official Pi App servers. Click any log entry below to debug live HTTP request payloads, error codes, and server response JSONs."}
        </p>

        {serverLogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-5 text-center">
            <p className="text-xs text-slate-400 dark:text-zinc-650 italic font-mono">
              {lang === "RU" ? "Нет логов. Сделайте попытку оплаты в Pi Browser." : "No gateway logs registered yet. Trigger a payment inside your Pi Browser."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logs List */}
            <div className="border border-slate-150 dark:border-zinc-800 rounded-xl bg-slate-50/20 dark:bg-zinc-950/40 h-56 overflow-y-auto p-2.5 space-y-1.5 font-mono text-[10px] scrollbar-thin">
              {serverLogs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedLogId(log.id === selectedLogId ? null : log.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-all transition-colors duration-150 ${
                    selectedLogId === log.id 
                      ? "border-purple-300 bg-purple-50/20 dark:border-purple-900/40 dark:bg-purple-950/10" 
                      : "border-slate-100 bg-white/70 hover:bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 finish-row">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8.5px] text-slate-400 shrink-0">{log.timestamp}</span>
                      <span className={`px-1 rounded text-[8px] font-black uppercase ${
                        log.endpoint === "approve" ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-400" : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400"
                      }`}>
                        /{log.endpoint}
                      </span>
                    </div>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      log.level === "success" ? "bg-emerald-500" :
                      log.level === "error" ? "bg-red-500" : "bg-blue-400"
                    }`} />
                  </div>
                  <div className="font-bold text-slate-700 dark:text-zinc-350 mt-1 line-clamp-1 break-all">
                    {log.message}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-550 mt-0.5 flex justify-between">
                    <span>ID: {log.paymentId.substring(0, 12)}...</span>
                    {log.txid && <span className="text-purple-650 dark:text-purple-400 text-[8.5px]">Tx: {log.txid.substring(0, 8)}...</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Log Inspector */}
            <div className="border border-slate-150 dark:border-zinc-800 rounded-xl bg-slate-900 text-slate-200 dark:bg-zinc-950 p-3 h-56 flex flex-col font-mono text-[9px]">
              <div className="border-b border-slate-750 pb-1.5 mb-2.5 flex items-center justify-between">
                <span className="text-slate-400 uppercase font-bold text-[8.5px]">JSON DATA PAYLOAD</span>
                {selectedLogId ? (
                  <span className="text-purple-400 text-[7.5px] font-bold">LOG ID: {selectedLogId.split("-")[1]}</span>
                ) : (
                  <span className="text-slate-500 italic text-[7.5px]">select log to view details</span>
                )}
              </div>
              <div className="flex-1 overflow-auto scrollbar-thin leading-normal select-text selection:bg-purple-900/50">
                {selectedLogId ? (
                  (() => {
                    const log = serverLogs.find(l => l.id === selectedLogId);
                    if (!log) return <span className="text-slate-500">Log entry not found anymore</span>;
                    return (
                      <pre className="whitespace-pre-wrap leading-tight text-emerald-400 dark:text-emerald-500">
                        {JSON.stringify(log.data || { info: "No telemetry data object attached to this log entry" }, null, 2)}
                      </pre>
                    );
                  })()
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-1">
                    <Terminal className="h-5 w-5 text-slate-600 mb-1" />
                    <p className="font-bold uppercase tracking-wider text-[8px]">Debugger Terminal Idle</p>
                    <p className="max-w-[200px] text-[8px] leading-relaxed">
                      {lang === "RU" ? "Нажмите на любой лог слева, чтобы изучить подробный отчет обмена" : "Click on any log record on the left pane to explore full exchange telemetry."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
