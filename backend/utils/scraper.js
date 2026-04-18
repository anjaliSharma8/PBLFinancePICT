const puppeteer = require("puppeteer");

function getURL(type) {
    switch (type) {
        case "personal": return "https://www.bankbazaar.com/personal-loan.html";
        case "home": return "https://www.bankbazaar.com/home-loan.html";
        case "car": return "https://www.bankbazaar.com/car-loan.html";
        case "two-wheeler": return "https://www.bankbazaar.com/two-wheeler-loan.html";
        case "used-car": return "https://www.bankbazaar.com/used-car-loan.html";
        case "education": return "https://www.bankbazaar.com/education-loan.html";
        case "gold": return "https://www.bankbazaar.com/gold-loan.html";
        default: return null;
    }
}

async function scrapeLoans(type) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const url = getURL(type);
        if (!url) return null;

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        const data = await page.evaluate(() => {
            let loans = [];

            const elements = document.querySelectorAll("body *");

            elements.forEach(el => {
                const text = el.innerText;

                if (text && text.includes("%") && text.toLowerCase().includes("loan")) {
                    const rateMatch = text.match(/(\d+(\.\d+)?)%/);

                    if (rateMatch) {
                        loans.push({
                            bank: text.split("\n")[0]?.trim(),
                            interestRate: parseFloat(rateMatch[1])
                        });
                    }
                }
            });

            return loans.slice(0, 10);
        });

        await browser.close();
        return data;

    } catch (err) {
        console.log("Scraping failed:", err.message);
        return null;
    }
}

module.exports = scrapeLoans;