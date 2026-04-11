const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//
// --- BUDGET AI (Gemini) ---
//
async function getBudgetSuggestion(data) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
User Monthly Income: ₹${data?.income || 0}
Monthly Budget Limit: ₹${data?.totalBudget || 0}
Current Spending: ₹${data?.totalSpent || 0}
Budget Used: ${Number(data?.usagePercent || 0).toFixed(2)}%

Spending By Category:
${data?.categoryBreakdown || "No Data"}

Give:
1. Judgment (GOOD / MODERATE / OVERSPENDING)
2. Highest spending category
3. Month-end prediction
4. 2 tips

Keep it short.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error) {
    console.error("Budget AI Error:", error.message);
    return "AI unavailable";
  }
}

//
// --- LOAN AI (Gemini) ---
//
async function generateLoanAnalysis(userProfile, loans) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a financial advisor.

User:
Credit Score: ${userProfile.creditScore}
Loan Amount: ₹${userProfile.amount}
Purpose: ${userProfile.purpose}

Loans:
${JSON.stringify(loans)}

Return JSON:
{
  "topRecommendation": "...",
  "fastestOption": "..."
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '');

    return JSON.parse(text);

  } catch (error) {
    console.error("Loan AI Error:", error.message);

    return {
      topRecommendation: "AI unavailable",
      fastestOption: "AI unavailable"
    };
  }
}

module.exports = { getBudgetSuggestion, generateLoanAnalysis };