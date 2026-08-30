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
      return Response.json(await getMockAnalysis(transactionData, functionSignature));
    }

    // Real 0G Compute Router API call (OpenAI-compatible)
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
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

Respond in JSON format:
{
  "classification": "CATEGORY",
  "confidence": 0.0-1.0,
  "threatLevel": 1-10,
  "reasoning": "explanation",
  "recommendation": "action to take"
}`
          },
          {
            role: "user",
            content: `Analyze this transaction for potential exploits:

Contract: ${contractAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f8fEb3"}
Function: ${functionSignature || "withdraw(uint256)"}
Data: ${JSON.stringify(transactionData || { value: "1000000000000000000", gasUsed: 250000 })}

Check for reentrancy patterns, flash loan indicators, oracle manipulation, and access control violations.`
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("0G Compute API error:", errorText);
      // Fallback to mock on error
      return Response.json(await getMockAnalysis(transactionData, functionSignature));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse the AI response as JSON
    let analysis;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      analysis = {
        classification: "SUSPICIOUS",
        confidence: 0.7,
        threatLevel: 5,
        reasoning: content,
        recommendation: "Manual review recommended",
      };
    }

    const result = {
      ...analysis,
      source: "0g-compute",
      model: data.model || "meta-llama/Llama-4-Scout-17B-16E-Instruct",
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
 * Mock analysis for demo when 0G Compute API key is not configured
 */
async function getMockAnalysis(transactionData, functionSignature) {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 500));

  const sig = functionSignature || "";
  
  if (sig.includes("withdraw") || sig.includes("reentrancy")) {
    return {
      classification: "CRITICAL_REENTRANCY",
      confidence: 0.973,
      threatLevel: 9,
      reasoning: "Detected recursive call pattern in withdraw function. External call precedes state update, creating reentrancy window. Gas consumption pattern matches known reentrancy exploits.",
      recommendation: "TRIGGER CIRCUIT BREAKER  - Pause protocol immediately. Evidence hash stored on 0G Storage.",
      source: "0g-compute-mock",
      model: "sentin0g-classifier-v1",
      timestamp: new Date().toISOString(),
    };
  }

  if (sig.includes("flash") || sig.includes("loan") || sig.includes("swap")) {
    return {
      classification: "CRITICAL_FLASH_LOAN",
      confidence: 0.948,
      threatLevel: 8,
      reasoning: "Flash loan borrow detected followed by large swap causing >15% price deviation. Pattern matches known flash loan oracle manipulation vector.",
      recommendation: "TRIGGER CIRCUIT BREAKER  - Freeze affected pools. Monitor for repayment failure.",
      source: "0g-compute-mock",
      model: "sentin0g-classifier-v1",
      timestamp: new Date().toISOString(),
    };
  }

  return {
    classification: "SAFE",
    confidence: 0.92,
    threatLevel: 1,
    reasoning: "Transaction pattern within normal parameters. No exploit signatures detected.",
    recommendation: "No action required. Continue monitoring.",
    source: "0g-compute-mock",
    model: "sentin0g-classifier-v1",
    timestamp: new Date().toISOString(),
  };
}
