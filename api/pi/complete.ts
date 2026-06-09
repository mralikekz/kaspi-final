const getPiApiKey = (): string | undefined => {
  return process.env.PI_API_KEY || 
         process.env.PI_SERVER_KEY || 
         process.env.PI_KEY || 
         process.env.MINEPI_API_KEY || 
         process.env.MINEPI_KEY || 
         process.env.MINEPI_SERVER_KEY ||
         "akzcrcxf9gkkb3xbe2kxskkkc1x46khrgqk6u8iqs61fl5iefe1zxjhm4tvekt6m";
};

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { paymentId, txid, isSandboxSimulation } = req.body || {};
  if (!paymentId || !txid) {
    console.error("[Pi /api/pi/complete] Missing paymentId or txid parameters");
    return res.status(400).json({ error: "Missing required parameters: paymentId or txid" });
  }

  const isMock = !!isSandboxSimulation || paymentId.startsWith("MOCK_") || txid.startsWith("MOCK_");
  const apiKey = getPiApiKey();

  console.log(`[Pi /api/pi/complete] Incoming request for paymentId: ${paymentId}, txid: ${txid}. isMock: ${isMock}, hasApiKey: ${!!apiKey}`);

  if (!apiKey) {
    if (isMock) {
      console.log(`[Pi /api/pi/complete] Mock Sandbox simulated completion successful for payment ${paymentId}`);
      return res.status(200).json({ success: true, message: "Sandbox completion simulated successfully", mocked: true, identifier: paymentId, transaction: { txid } });
    }
    const errMsg = "PI_API_KEY is missing on server. Blockchain payment cannot be finalized without a valid developer key.";
    console.error("[Pi /api/pi/complete] PI_API_KEY is missing on server");
    return res.status(400).json({
      success: false,
      error: "PI_API_KEY_MISSING",
      message: errMsg
    });
  }

  try {
    console.log(`[Pi /api/pi/complete] Calling Pi core API POST completion for paymentId: ${paymentId}, txid: ${txid}`);
    const apiRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const bodyText = await apiRes.text();
    let data: any = {};
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = { rawText: bodyText };
    }

    if (apiRes.ok) {
      console.log("[Pi /api/pi/complete] Pi payment successfully finalized and recorded as settled on chain!", data);
      return res.status(200).json({
        success: true,
        data,
        ...data
      });
    } else {
      console.error(`[Pi /api/pi/complete] Pi Core API rejected completion with status ${apiRes.status}`, data);
      return res.status(apiRes.status).json({
        success: false,
        error: "Pi API completion error",
        details: data,
        ...data
      });
    }
  } catch (err: any) {
    console.error(`[Pi /api/pi/complete] Exception during completion handler: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
}
