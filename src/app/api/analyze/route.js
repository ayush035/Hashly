/**
 * POST /api/analyze
 * 
 * Sends transaction data to 0G Compute Router for AI-powered exploit classification.
 * Uses the OpenAI-compatible /v1/chat/completions endpoint.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { transactionData, contractAddress, functionSignature } = body;

    const apiKey = process.env.ZG_COMPUTE_API_KEY;
    const baseUrl = process.env.ZG_COMPUTE_BASE_URL || "https://router-api-testnet.integratenetwork.work/v1";

    // If no API key, return mock analysis for demo
    if (!apiKey || apiKey === "your_0g_compute_api_key_here") {
      return Response.json(await getMockAnalysis(transactionData, functionSignature, "Missing ZG_COMPUTE_API_KEY"));
    }

    // Attempt real 0G Compute Router API call
    let response;
    let usedModel = "qwen2.5-omni";

    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: usedModel,
          messages: [
            {
              role: "system",
              content: `You are Sentin0G, an AI security analyst specialized in DeFi smart contract exploit detection.
              
Analyze the transaction data and classify it into one of these threat categories:
- SAFE: Normal transaction, no threat detected
- SUSPICIOUS: Unusual pattern worth monitoring
- CRITICAL_REENTRANCY: Reentrancy attack pattern detected
- CRITICAL_FLASH_LOAN: Flash loan exploitation pattern
- CRITICAL_ORACLE: Oracle manipulation attempt
- CRITICAL_ACCESS: Unauthorized access attempt

Respond ONLY in valid JSON:
{
  "classification": "CATEGORY",
  "confidence": 0.95,
  "threatLevel": 8,
  "reasoning": "Detailed explanation of exploit signature",
  "recommendation": "TRIGGER CIRCUIT BREAKER - Pause protocol"
}`
            },
            {
              role: "user",
              content: `Analyze this transaction for potential exploits:

Contract: ${contractAddress || "0x67717afbCa0c2A4E060B2Ef0621bF33ef07908C5"}
Function: ${functionSignature || "withdraw(uint256)"}
Data: ${JSON.stringify(transactionData || { value: "1000000000000000000", gasUsed: 380000, callDepth: 4 })}

Check for reentrancy patterns, flash loan indicators, oracle manipulation, and access control violations.`
            }
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });
    } catch (networkErr) {
      console.error("0G Compute Network error:", networkErr);
      return Response.json(await getMockAnalysis(transactionData, functionSignature, networkErr.message));
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`0G Compute API returned ${response.status}:`, errorText);
      // Fallback with detailed error notice
      return Response.json(await getMockAnalysis(
        transactionData,
        functionSignature,
        `0G Compute ${response.status}: ${errorText}`
      ));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse the AI response as JSON
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      analysis = {
        classification: "SUSPICIOUS",
        confidence: 0.85,
        threatLevel: 6,
        reasoning: content || "Exploit pattern detected by 0G Compute model.",
        recommendation: "Review and monitor transaction.",
      };
    }

    const result = {
      ...analysis,
      source: "0g-compute-live",
      model: data.model || usedModel,
      usage: data.usage,
      trace: data.x_0g_trace,
      provider: data.x_0g_trace?.provider,
      requestId: data.x_0g_trace?.request_id || data.id,
      timestamp: new Date().toISOString(),
    };

    // Store evidence on 0G Storage if threat detected
    if (analysis.threatLevel >= 5) {
      try {
        const storageRes = await fetch(new URL("/api/storage", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evidenceData: { analysis: result, transactionData, contractAddress },
            alertId: `alert-${Date.now()}`,
            threatType: analysis.classification,
          }),
        });
        const storageData = await storageRes.json();
        result.evidenceHash = storageData.rootHash;
        result.storageSource = storageData.source;
      } catch (e) {
        console.error("Evidence storage error:", e.message);
      }
    }

    return Response.json(result);

  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Analysis failed", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mock analysis fallback when 0G Compute router returns an error (e.g. 402 Insufficient Balance)
 */
async function getMockAnalysis(transactionData, functionSignature, computeNote = "") {
  await new Promise((r) => setTimeout(r, 400));

  const sig = functionSignature || "";
  
  if (sig.includes("withdraw") || sig.includes("reentrancy")) {
    return {
      classification: "CRITICAL_REENTRANCY",
      confidence: 0.973,
      threatLevel: 9,
      reasoning: "Detected recursive call pattern in withdraw function. External call precedes state update, creating reentrancy window. Gas consumption pattern matches known reentrancy exploits.",
      recommendation: "TRIGGER CIRCUIT BREAKER - Pause protocol immediately. Evidence hash stored on 0G Storage.",
      source: computeNote ? `fallback (${computeNote.slice(0, 60)})` : "0g-compute-fallback",
      model: "qwen2.5-omni (fallback)",
      computeNote,
      timestamp: new Date().toISOString(),
    };
  }

  if (sig.includes("flash") || sig.includes("loan") || sig.includes("swap")) {
    return {
      classification: "CRITICAL_FLASH_LOAN",
      confidence: 0.948,
      threatLevel: 8,
      reasoning: "Flash loan borrow detected followed by large swap causing >15% price deviation. Pattern matches known flash loan oracle manipulation vector.",
      recommendation: "TRIGGER CIRCUIT BREAKER - Freeze affected pools. Monitor for repayment failure.",
      source: computeNote ? `fallback (${computeNote.slice(0, 60)})` : "0g-compute-fallback",
      model: "qwen2.5-omni (fallback)",
      computeNote,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    classification: "SAFE",
    confidence: 0.92,
    threatLevel: 1,
    reasoning: "Transaction pattern within normal parameters. No exploit signatures detected.",
    recommendation: "No action required. Continue monitoring.",
    source: computeNote ? `fallback (${computeNote.slice(0, 60)})` : "0g-compute-fallback",
    model: "qwen2.5-omni (fallback)",
    computeNote,
    timestamp: new Date().toISOString(),
  };
}
