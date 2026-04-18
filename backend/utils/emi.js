function calculateEMI(P, rate, tenure) {
    let r = rate / 12 / 100;

    return (
        (P * r * Math.pow(1 + r, tenure)) /
        (Math.pow(1 + r, tenure) - 1)
    );
}

module.exports = calculateEMI;