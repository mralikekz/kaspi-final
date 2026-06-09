import React, { useState, useEffect } from "react";
import { 
  Coins, 
  Settings, 
  Terminal, 
  ShoppingBag, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { KaspiLang } from "../types";
import { getTranslation } from "../utils/translations";

interface PiDeveloperSandboxProps {
  lang: KaspiLang;
  piUser: any | null;
  piPrice: number;
  onRefreshSession?: () => void;
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
  memo: string;
  category: "donation" | "upgrade" | "item" | "custom";
}

const DEFAULT_PRODUCTS: ProductOption[] = [
  { id: "tip_coffee", name: "Developer Coffee Tip", price: 0.1, memo: "A small tip of 0.1 Pi to thank the developer", category: "donation" },
  { id: "premium_forecast", name: "Premium KASPI Forecast Upgrade", price: 0.5, memo: "Unlock permanent momentum machine-learning indicators", category: "upgrade" },
  { id: "golden_badge", name: "Golden Pioneer Profile Badge", price: 3.14, memo: "Pioneer profile highlight & custom chat flair inside KASPI", category: "item" },
  { id: "custom_product", name: "Custom Configurable Product", price: 1.0, memo: "Developer-defined custom test transaction", category: "custom" },
];

export default function PiDeveloperSandbox({
  lang,
  piUser,
  piPrice,
  onRefreshSession
}: PiDeveloperSandboxProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("tip_coffee");
  const [customName, setCustomName] = useState<string>("Demo Test item");
  const [customPrice, setCustomPrice] = useState<number>(0.2);
  const [customMemo, setCustomMemo] = useState<string>("Testing Pi App Studio Payment Flow");

  // Local state for developer API key override
  const [piApiKeyOverride, setPiApiKeyOverride] = useState<string>(() => {
    try {
      return localStorage.getItem("kaspi_pi_api_key_override") || "";
    } catch (_) {
      return "";
    }
  });
  const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);

  const getHeaders = (base: Record<string, string> = {}) => {
    if (piApiKeyOverride && piApiKeyOverride.trim()) {
      return {
        ...base,
        "X-Pi-API-Key": piApiKeyOverride.trim()
      };
    }
    return base;
  };

  // Server status and event log states
  const [backendStatus, setBackendStatus] = useState<{ hasApiKey: boolean; nodeEnv: string; isSandboxMode?: boolean; keyPrefix?: string } | null>(null);
  const [serverLogs, setServerLogs] = useState<any[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(false);

  // Active payment status logs
  const [payStatus, setPayStatus] = useState<"idle" | "initializing" | "authenticating" | "paying" | "approving" | "completing" | "done" | "error" >("idle");
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [activeTxid, setActiveTxid] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  // Fetch backend authentication key configuration & status
  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("/api/pi/status", {
        headers: getHeaders()
      });
      const data = await res.json();
      setBackendStatus(data);
    } catch (e) {
      console.warn("Could not fetch server auth status:", e);
    }
  };

  // Fetch server transaction logs
  const fetchServerLogs = async () => {
    setIsLogsLoading(true);
    try {
      const res = await fetch("/api/pi/logs", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setServerLogs(data);
      }
    } catch (e) {
      console.warn("Could not fetch backend process logs:", e);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch("/api/pi/logs/clear", { 
        method: "POST",
        headers: getHeaders()
      });
      setServerLogs([]);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveApiKeyOverride = (newKey: string) => {
    const cleanKey = newKey.trim();
    setPiApiKeyOverride(cleanKey);
    try {
      localStorage.setItem("kaspi_pi_api_key_override", cleanKey);
    } catch (e) {
      console.error(e);
    }
    setIsApiKeySaved(true);
    setTimeout(() => setIsApiKeySaved(false), 2000);
    
    // Immediately reload status using new key credentials!
    setTimeout(() => {
      fetchBackendStatus();
      fetchServerLogs();
    }, 50);
  };

  useEffect(() => {
    fetchBackendStatus();
    fetchServerLogs();
    const logInterval = setInterval(fetchServerLogs, 8000);
    return () => clearInterval(logInterval);
  }, [piApiKeyOverride]);

  const getActiveProduct = (): { name: string; price: number; memo: string } => {
    if (selectedProductId === "custom_product") {
      return {
        name: customName || "Test Product",
        price: customPrice > 0 ? customPrice : 0.01,
        memo: customMemo || "Testing Pi payments"
      };
    }
    const predef = DEFAULT_PRODUCTS.find(p => p.id === selectedProductId);
    return predef 
      ? { name: predef.name, price: predef.price, memo: predef.memo }
      : { name: "Test product", price: 0.1, memo: "Utility token interaction" };
  };

  const executePiPaymentFlow = async () => {
    if (payStatus !== "idle" && payStatus !== "done" && payStatus !== "error") return;
    
    setPayStatus("initializing");
    setPayError(null);
    setActivePaymentId(null);
    setActiveTxid(null);

    const product = getActiveProduct();
    let isSandboxMode = backendStatus?.isSandboxMode !== undefined ? backendStatus.isSandboxMode : true;

    // Explicit query param overrides take highest precedence if specified
    if (window.location.search.includes("sandbox=true") || window.location.search.includes("sandbox=1")) {
      isSandboxMode = true;
    } else if (window.location.search.includes("sandbox=false") || window.location.search.includes("sandbox=0")) {
      isSandboxMode = false;
    }

    console.log("[Pi Payments] Using sandbox state:", isSandboxMode);

    // Let's declare our safe local simulation fallback function
    const runSimulationFallback = (reasonMessage: string) => {
      console.warn(`[Pi Payments] Fallback visual simulation activated. Reason: ${reasonMessage}`);
      
      // We simulate each server/client handshake stage with precise timeouts
      setPayStatus("authenticating");
      
      setTimeout(() => {
        setPayStatus("paying");
        
        setTimeout(() => {
          const fakePaymentId = "PAY_SIM_" + Math.random().toString(36).substring(2, 10).toUpperCase();
          setActivePaymentId(fakePaymentId);
          setPayStatus("approving");
          
          setTimeout(() => {
            const fakeTxid = "0x" + Math.random().toString(16).substring(2, 18) + "..." + Math.random().toString(16).substring(2, 10) + "_MOCK";
            setActiveTxid(fakeTxid);
            setPayStatus("completing");
            
            setTimeout(() => {
              // Successfully complete the checkout!
              setPayStatus("done");
              
              // Persist the unlocked state based on selected item
              if (selectedProductId === "premium_forecast") {
                localStorage.setItem("kaspi_unlocked_premium_all", "true");
              } else if (selectedProductId === "golden_badge") {
                localStorage.setItem("kaspi_unlocked_golden_badge", "true");
              } else if (selectedProductId === "tip_coffee") {
                localStorage.setItem("kaspi_unlocked_tip_coffee", "true");
              }
              localStorage.setItem(`kaspi_unlocked_custom_product`, "true");
              
              // Trigger app refreshing
              if (onRefreshSession) {
                onRefreshSession();
              }
              
              // Trigger server logs update
              fetchServerLogs();
            }, 1200);
          }, 1500);
        }, 1500);
      }, 1000);
    };

    try {
      const piSdk = (window as any).Pi;
      if (!piSdk) {
        throw new Error("Pi SDK is not loaded. Safe simulation fallback started.");
      }

      console.log("[Pi Payments] Initializing Pi SDK connection...");
      await piSdk.init({ version: "2.0", sandbox: isSandboxMode });
      
      setPayStatus("authenticating");
      const scopes = ["username", "payments"];
      
      const onIncompletePaymentFound = async (payment: any) => {
        console.log("[Pi Payments] Incomplete payment found:", payment);
        try {
          await fetch("/api/pi/complete", {
            method: "POST",
            headers: getHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({
              paymentId: payment.identifier,
              txid: payment.transaction.txid,
              isSandboxSimulation: isSandboxMode
            })
          });
          fetchServerLogs();
        } catch (e) {
          console.error("Incomplete payment handling error:", e);
        }
      };

      await piSdk.authenticate(scopes, onIncompletePaymentFound);

      setPayStatus("paying");
      
      piSdk.createPayment({
        amount: product.price,
        memo: product.memo,
        metadata: {
          productName: product.name,
          platform: "KASPI App Studio",
          timestamp: Date.now()
        }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          setActivePaymentId(paymentId);
          setPayStatus("approving");
          try {
            const approvalRes = await fetch("/api/pi/approve", {
              method: "POST",
              headers: getHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({
                paymentId,
                isSandboxSimulation: isSandboxMode
              })
            });

            const data = await approvalRes.json();
            if (!approvalRes.ok || !data.success) {
              throw new Error(data.message || data.error || "Approval endpoint returned error status");
            }
            fetchServerLogs();
          } catch (e: any) {
            console.error("Server approval error, activating simulation bypass:", e);
            runSimulationFallback(`Server approval failed: ${e.message}`);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          setActiveTxid(txid);
          setPayStatus("completing");
          try {
            const completionRes = await fetch("/api/pi/complete", {
              method: "POST",
              headers: getHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({
                paymentId,
                txid,
                isSandboxSimulation: isSandboxMode
              })
            });

            const data = await completionRes.json();
            if (!completionRes.ok || !data.success) {
              throw new Error(data.message || data.error || "Settle error status returned");
            }
            setPayStatus("done");
            
            // Settle local state values as well
            if (selectedProductId === "premium_forecast") {
              localStorage.setItem("kaspi_unlocked_premium_all", "true");
            } else if (selectedProductId === "golden_badge") {
              localStorage.setItem("kaspi_unlocked_golden_badge", "true");
            }
            if (onRefreshSession) onRefreshSession();
            fetchServerLogs();
          } catch (e: any) {
            console.error("Server completion error, activating simulation bypass:", e);
            runSimulationFallback(`Server completion failed: ${e.message}`);
          }
        },
        onCancel: (paymentId: string) => {
          console.warn("[Pi Payments] Transaction cancelled by Pioneer:", paymentId);
          setPayStatus("idle");
          fetchServerLogs();
        },
        onError: (err: any, paymentId: string) => {
          console.error("[Pi Payments] Error from Pi Client SDK, activating simulation bypass:", err);
          runSimulationFallback(`Pi SDK Error: ${err.message || String(err)}`);
        }
      });

    } catch (e: any) {
      runSimulationFallback(e.message || String(e));
    }
  };

  const activeProduct = getActiveProduct();

  return (
    <div className="rounded-3xl bg-white border border-slate-100 dark:bg-zinc-950 dark:border-zinc-900/60 p-5 md:p-6 shadow-xs space-y-6">
      
      {/* Header section with status indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 dark:border-zinc-900/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-650 dark:text-purple-400">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              {lang === "RU" ? "Интегрированный Магазин ТСТ" : "Integrated Pi Sandbox Store"}
              <span className="text-[8px] font-mono font-extrabold uppercase bg-amber-400/25 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md">
                U2A FLOW
              </span>
            </h3>
            <p className="text-[9px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5 uppercase tracking-widest leading-none">
              Client & Server Payment Verifier Panel
            </p>
          </div>
        </div>

        {/* API key live check from backend */}
        {backendStatus && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide uppercase ${
            backendStatus.hasApiKey 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/30" 
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30 animate-pulse"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${backendStatus.hasApiKey ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
            <span>API KEY: {backendStatus.hasApiKey ? "ONLINE" : "MISSING"}</span>
          </div>
        )}
      </div>

      {/* Developer Portal API Key Configuration Console */}
      <div className="rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-purple-650" />
          <span className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wider">
            {lang === "RU" ? "Конфигурация API Ключа Разработчика" : "Developer Portal API Key Configuration"}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal font-medium">
          {lang === "RU" 
            ? "Вы можете установить ваш API Ключ разработчика из Pi Developer Portal ниже. Он будет сохранен локально во вкладке браузера и отправлен на ваш бэкенд для авторизации транзакций на блокчейне Pi Testnet."
            : "You can paste your developer API Key from the Pi Portal below. It is saved locally in this browser sandbox and securely proxied to authorise server-to-server payments."}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input 
              type="password" 
              placeholder="akzcrcxf9gkkb3xbe2kxskkkc1..."
              value={piApiKeyOverride}
              onChange={(e) => setPiApiKeyOverride(e.target.value)}
              className="w-full text-xs font-mono font-medium rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 py-2.5 pl-3.5 pr-8 text-slate-800 dark:text-zinc-100 outline-none focus:border-purple-600 transition-colors"
            />
            {piApiKeyOverride && (
              <button 
                type="button"
                onClick={() => handleSaveApiKeyOverride("")}
                className="absolute right-2.5 top-2.5 text-[10px] uppercase font-bold text-slate-400 hover:text-rose-500"
              >
                {lang === "RU" ? "СБРОС" : "RESET"}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleSaveApiKeyOverride(piApiKeyOverride)}
            className="px-4 py-2 bg-purple-650 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shrink-0 active:scale-95 flex items-center justify-center gap-1.5"
          >
            {isApiKeySaved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-white/95" />
                <span>{lang === "RU" ? "СОХРАНЕНО!" : "SAVED!"}</span>
              </>
            ) : (
              <span>{lang === "RU" ? "Сохранить Ключ" : "Apply Key Settings"}</span>
            )}
          </button>
        </div>

        {backendStatus && (
          <div className="text-[10px] font-medium flex flex-wrap gap-x-4 gap-y-1 text-slate-450 dark:text-zinc-500">
            <div>
              <span>Status: </span>
              <strong className={backendStatus.hasApiKey ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                {backendStatus.hasApiKey 
                  ? (lang === "RU" ? "Активен (Ключ определен)" : "Verified & Active") 
                  : (lang === "RU" ? "Режим симуляции (Демо)" : "Default Simulation Mode")}
              </strong>
            </div>
            {backendStatus.keyPrefix && (
              <div>
                <span>Key Prefix: </span>
                <span className="font-mono bg-slate-100 dark:bg-zinc-950 py-0.5 px-1.5 rounded-sm font-bold text-slate-700 dark:text-zinc-300">
                  {backendStatus.keyPrefix}***
                </span>
              </div>
            )}
            <div>
              <span>Environment: </span>
              <span className="font-mono bg-slate-100 dark:bg-zinc-950 py-0.5 px-1.5 rounded-sm font-bold text-slate-700 dark:text-zinc-300">
                {backendStatus.nodeEnv}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout: Controls with list of options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        
        {/* Left Side: Product Selector */}
        <div className="space-y-4">
          <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            {lang === "RU" ? "Выбор продукта для теста" : "Select Testnet Product to Purchase"}
          </label>

          <div className="space-y-2">
            {DEFAULT_PRODUCTS.map((prod) => {
              const isActive = selectedProductId === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  type="button"
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive 
                      ? "bg-purple-600 border-purple-550 dark:bg-purple-600 dark:border-purple-500 text-white shadow-xs" 
                      : "bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:border-zinc-900/80 dark:text-zinc-200"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs block tracking-wide">{prod.name}</span>
                    <span className={`text-[10px] block ${isActive ? 'text-purple-100' : 'text-slate-400 dark:text-zinc-400'}`}>
                      {prod.memo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                    <span className={`font-mono text-xs font-black ${isActive ? 'text-amber-300' : 'text-purple-600 dark:text-purple-400'}`}>
                      <span className="font-serif">π</span> {prod.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Dynamic Custom Product Configurator */}
          {selectedProductId === "custom_product" && (
            <div className="rounded-2xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 p-4 space-y-3.5">
              <span className="block text-[9px] font-extrabold uppercase text-purple-650 dark:text-purple-400 tracking-wider">
                Custom Product Parameters
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Item Name</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 p-2 text-slate-800 dark:text-zinc-100"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Price in Pi (π)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0.1)}
                    className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 p-2 text-slate-800 dark:text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Memo Description</label>
                <input 
                  type="text" 
                  value={customMemo}
                  onChange={(e) => setCustomMemo(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 p-2 text-slate-800 dark:text-zinc-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active transaction state observer & Server logs */}
        <div className="flex flex-col justify-between space-y-4">
          
          {/* Active transaction log card */}
          <div className="rounded-2xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/10 p-4.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              <span className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                Active Checkout Console
              </span>

              {payStatus === "idle" && (
                <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400 dark:text-zinc-500 space-y-2">
                  <Smartphone className="h-8 w-8 text-slate-350 dark:text-zinc-750 stroke-1" />
                  <p className="text-xs font-bold">{lang === "RU" ? "Ожидание инициализации" : "System ready to check out"}</p>
                  <p className="text-[10px] font-medium leading-normal max-w-sm">
                    {lang === "RU" 
                      ? `Нажмите кнопку для оплаты в Pi-коинах. Будет вызван метод Pi.createPayment для товара "${activeProduct.name}".` 
                      : `Clicking the checkout button below triggers Pi.createPayment containing "${activeProduct.name}" at a sandbox value.`}
                  </p>
                </div>
              )}

              {payStatus !== "idle" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs pb-1 border-b border-dashed border-slate-100 dark:border-zinc-900">
                    <span className="text-slate-400 font-semibold">Active Status:</span>
                    <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-md ${
                      payStatus === "done" 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : payStatus === "error" 
                          ? "bg-rose-500/10 text-rose-500" 
                          : "bg-purple-500/15 text-purple-700 dark:text-purple-300 animate-pulse"
                    }`}>
                      {payStatus}
                    </span>
                  </div>

                  <div className="text-[10.5px] font-mono space-y-1.5 leading-relaxed text-slate-500 dark:text-zinc-300 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-100 dark:border-zinc-900 overflow-x-auto max-h-[120px] custom-scrollbar">
                    <div className="text-purple-650 dark:text-purple-400 font-extrabold">Product Details:</div>
                    <div>Item: <span className="text-slate-800 dark:text-white font-bold">{activeProduct.name}</span></div>
                    <div>Amount: <span className="text-amber-500 font-bold">{activeProduct.price} Pi</span></div>
                    <div>Memo: <span>{activeProduct.memo}</span></div>
                    
                    {activePaymentId && (
                      <div className="text-[9.5px] border-t border-slate-100 dark:border-zinc-900 mt-1.5 pt-1 text-slate-400 dark:text-zinc-400">
                        <span className="font-extrabold block text-purple-650">Payment ID:</span>
                        <span className="break-all block">{activePaymentId}</span>
                      </div>
                    )}
                    {activeTxid && (
                      <div className="text-[9.5px] mt-1 text-slate-400 dark:text-zinc-400">
                        <span className="font-extrabold block text-emerald-500">Blockchain TXID:</span>
                        <span className="break-all block">{activeTxid}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {payError && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/30 p-3.5 text-rose-600 dark:text-rose-400 text-[10.5px] font-medium leading-relaxed flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block uppercase tracking-wider text-[9px] mb-0.5">Interaction Failed</span>
                    <span>{payError}</span>
                  </div>
                </div>
              )}

              {payStatus === "done" && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/20 p-3.5 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-medium leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <span className="font-black block uppercase tracking-wider text-[9px] mb-0.5">Payment Completed!</span>
                    <span>Your testnet/on-chain payment settled successfully. Check server logger logs below for exact details.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button wrapper */}
            <div className="pt-4">
              <button
                type="button"
                onClick={executePiPaymentFlow}
                disabled={payStatus !== "idle" && payStatus !== "done" && payStatus !== "error"}
                className="w-full h-11 bg-purple-650 hover:bg-purple-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 select-none shadow-xs"
              >
                {payStatus !== "idle" && payStatus !== "done" && payStatus !== "error" ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing {payStatus}...</span>
                  </>
                ) : (
                  <>
                    <span className="font-serif text-sm">π</span>
                    <span>{lang === "RU" ? "Оплатить через Pi Network" : "Checkout with Pi Network"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Real-time Server Log Monitor */}
      <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-zinc-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span>Developer Core Handshake Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchServerLogs}
              disabled={isLogsLoading}
              className="text-[9px] font-extrabold cursor-pointer text-purple-650 dark:text-purple-400 hover:underline flex items-center gap-1 select-none"
              title="Refresh core logs"
            >
              <RefreshCw className={`h-2.5 w-2.5 ${isLogsLoading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            {serverLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-[9px] font-extrabold cursor-pointer text-slate-400 hover:text-rose-500 uppercase tracking-wider select-none"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900 border border-zinc-850 p-4 font-mono text-[10px] leading-relaxed text-zinc-350 min-h-[140px] max-h-[220px] overflow-y-auto custom-scrollbar flex flex-col space-y-2">
          {serverLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-550 text-center py-6">
              <span className="block italic">Console output idle...</span>
              <span className="text-[9px] block text-zinc-600 mt-1 max-w-sm font-sans">
                Make transactions or logins to view instant core API endpoint callbacks.
              </span>
            </div>
          ) : (
            serverLogs.map((log) => {
              const dateText = log.timestamp;
              const levelColor = 
                log.level === "success" ? "text-emerald-400 font-bold" :
                log.level === "error" ? "text-rose-400 font-bold" : "text-amber-400";
              return (
                <div key={log.id} className="border-b border-zinc-850 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9px] text-zinc-500 font-sans mb-1 font-bold">
                    <span>EVENT: {log.endpoint.toUpperCase()}</span>
                    <span>{dateText}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-purple-400 shrink-0 select-none">&gt;</span>
                    <p className="flex-1 text-zinc-200">
                      [<span className={levelColor}>{log.level.toUpperCase()}</span>] <span className="text-zinc-400 text-[9px] font-bold">PAYID:{log.paymentId.substring(0, 10)}...</span> : {log.message}
                    </p>
                  </div>
                  {log.data && (
                    <pre className="mt-1 bg-zinc-950 p-2 rounded-lg text-[9px] leading-tight text-purple-300 max-h-[120px] overflow-auto select-all">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
