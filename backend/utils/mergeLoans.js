function mergeLoans(baseLoans, scrapedLoans, type) {
    if (!scrapedLoans) return baseLoans;

    return baseLoans.map(base => {
        if (base.type !== type) return base;

        const match = scrapedLoans.find(s =>
            s.bank.toLowerCase().includes(base.bank.toLowerCase())
        );

        if (match && match.interestRate) {
            return {
                ...base,
                interestRate: match.interestRate,
                lastUpdated: new Date()
            };
        }

        return base;
    });
}

module.exports = mergeLoans;