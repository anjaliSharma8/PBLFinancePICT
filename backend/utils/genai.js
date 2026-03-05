const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getBudgetSuggestion(data) {

  const income = data?.income || 0;
  const totalBudget = data?.totalBudget || 0;
  const totalSpent = data?.totalSpent || 0;
  const usagePercent = data?.usagePercent || 0;
  const categoryBreakdown = data?.categoryBreakdown || "No Data";

  const prompt = `
User Monthly Income: ₹${income}
Monthly Budget Limit: ₹${totalBudget}
Current Spending: ₹${totalSpent}
Budget Used: ${Number(usagePercent).toFixed(2)}%

Spending By Category:
${categoryBreakdown}

Give:
1. Clear judgment (GOOD / MODERATE / OVERSPENDING)
2. Highest spending category
3. Month-end prediction
4. 2 short financial tips

Keep it short and practical.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = getBudgetSuggestion;