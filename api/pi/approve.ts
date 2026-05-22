const getPiApiKey = (): string | undefined => {
  return process.env.PI_API_KEY || 
         process.env.PI_SERVER_KEY || 
         process.env.PI_KEY || 
         process.env.MINEPI_API_KEY || 
         process.env.MINEPI_KEY || 
         process.env.MINEPI_SERVER_KEY;
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

  const { paymentId, isSandboxSimulation } = req.body || {};
  if (!paymentId) {
    console.error("[Pi /api/pi/approve] Missing paymentId parameters");
    return res.status(400).json({ error: "Missing paymentId parameter" });
  }

  const isMock = !!isSandboxSimulation || paymentId.startsWith("MOCK_");
  const apiKey = getPiApiKey();
  
  console.log(`[Pi /api/pi/approve] Incoming request for paymentId: ${paymentId}. isMock: ${isMock}, hasApiKey: ${!!apiKey}`);

  if (!apiKey) {
    if (isMock) {
      console.log(`[Pi /api/pi/approve] Mock Sandbox simulated approval successful for payment ${paymentId}`);
      return res.status(200).json({ success: true, message: "Sandbox simulation approved", mocked: true, identifier: paymentId });
    }
    const errMsg = "PI_API_KEY environment variable is not defined on the server! Real transactions in the Pi Browser require a configured API key to authorize payments. Please check your setup.";
    console.error("[Pi /api/pi/approve] PI_API_KEY is missing on the server");
    return res.status(400).json({
      success: false,
      error: "PI_API_KEY_MISSING",
      message: errMsg
    });
  }

  try {
    console.log(`[Pi /api/pi/approve] Calling Pi Core API POST approval for payment ${paymentId}`);
    const apiRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const bodyText = await apiRes.text();
    let data: any = {};
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = { rawText: bodyText };
    }

    if (apiRes.ok) {
      console.log("[Pi /api/pi/approve] Pi Core API successfully approved transaction!", data);
      return res.status(200).json({
        success: true,
        data,
        ...data
      });
    } else {
      console.error(`[Pi /api/pi/approve] Pi Core API rejected approval with status ${apiRes.status}`, data);
      return res.status(apiRes.status).json({
        success: false,
        error: "Pi API error",
        details: data,
        ...data
      });
    }
  } catch (err: any) {
    console.error(`[Pi /api/pi/approve] Exception during approve handler: ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
}
