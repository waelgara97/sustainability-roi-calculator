/**
 * Core Calculator Logic (Improved Version)
 * Handles ROI calculations based on user inputs, with realistic scaling for large companies
 */

// Store for saved scenarios
const savedScenarios = [];

// Currency formatter for displaying monetary values
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

/**
 * Main calculation function that computes ROI metrics
 */
function calculateROI() {
    // Get input values from form
    const industryCode = document.getElementById('industry').value;
    const revenue = parseFloat(document.getElementById('revenue').value) * 1000; // Convert K to actual dollars
    const supplierCount = document.getElementById('suppliers').value ? parseInt(document.getElementById('suppliers').value) : null;
    let procurementSpend = document.getElementById('procurement').value ? parseFloat(document.getElementById('procurement').value) * 1000 : null; // Convert K to actual dollars
    const carbonPrice = parseFloat(document.getElementById('carbon-price').value);
    const maturityCode = document.getElementById('maturity').value;
    const customInvestment = document.getElementById('investment').value ? parseFloat(document.getElementById('investment').value) * 1000 : null; // Convert K to actual dollars
    
    // Validate inputs
    if (!industryCode || isNaN(revenue) || !carbonPrice || !maturityCode) {
        alert("Please fill in all required fields");
        return;
    }
    
    // Get reference data
    const industry = industryParameters[industryCode];
    const maturity = maturityLevels[maturityCode];
    
    // Set service investment based on user input or scale by company size
    const serviceInvestment = {};
    
    if (customInvestment) {
        serviceInvestment.year1 = customInvestment;
        serviceInvestment.year2 = customInvestment * 1.1; // 10% increase year 2
        serviceInvestment.year3 = customInvestment * 1.16; // 16% increase year 3
    } else {
        // Scale investment based on company size using improved scaling
        const baseInvestment = improvedScaledInvestment(revenue);
        serviceInvestment.year1 = baseInvestment;
        serviceInvestment.year2 = baseInvestment * 1.1; // 10% increase year 2
        serviceInvestment.year3 = baseInvestment * 1.16; // 16% increase year 3
    }
    
    // Calculate procurement spend if not provided
    if (!procurementSpend) {
        procurementSpend = revenue * industry.procurementPercent;
    }
    
    // Calculate supply chain emissions
    const supplyChainEmissions = procurementSpend * industry.emissionFactor;
    
    // Calculate benefits for each year
    const benefits = {
        year1: calculateYearlyBenefits(1, industry, maturity, revenue, procurementSpend, supplyChainEmissions, carbonPrice),
        year2: calculateYearlyBenefits(2, industry, maturity, revenue, procurementSpend, supplyChainEmissions, carbonPrice),
        year3: calculateYearlyBenefits(3, industry, maturity, revenue, procurementSpend, supplyChainEmissions, carbonPrice)
    };
    
    // Calculate total investment cost
    const totalInvestment = serviceInvestment.year1 + serviceInvestment.year2 + serviceInvestment.year3;
    
    // Calculate total benefits
    const totalBenefits = benefits.year1.total + benefits.year2.total + benefits.year3.total;
    
    // Calculate ROI metrics
    const netBenefits = totalBenefits - totalInvestment;
    const roiRatio = totalBenefits / totalInvestment;
    
    // Calculate NPV (Net Present Value) with 10% discount rate
    const discountRate = 0.10;
    const netCashFlows = [
        benefits.year1.total - serviceInvestment.year1,
        benefits.year2.total - serviceInvestment.year2,
        benefits.year3.total - serviceInvestment.year3
    ];
    
    const npv = netCashFlows.reduce((acc, val, i) => {
        return acc + (val / Math.pow(1 + discountRate, i + 1));
    }, 0);
    
    // Calculate payback period in months
    let cumulativeCashFlow = -serviceInvestment.year1;
    let monthlyBenefit1 = benefits.year1.total / 12;
    let paybackMonths = 0;
    
    for (let month = 1; month <= 36; month++) {
        if (month <= 12) {
            cumulativeCashFlow += monthlyBenefit1;
        } else if (month <= 24) {
            cumulativeCashFlow += benefits.year2.total / 12;
        } else {
            cumulativeCashFlow += benefits.year3.total / 12;
        }
        
        if (cumulativeCashFlow >= 0 && paybackMonths === 0) {
            paybackMonths = month;
        }
    }
    
    // If never reaches payback
    if (paybackMonths === 0) {
        paybackMonths = 36; // Set to max period of 3 years
    }
    
    // Generate results HTML
    displayResults({
        industry,
        maturity,
        revenue,
        procurementSpend,
        supplyChainEmissions,
        benefits,
        serviceInvestment,
        netBenefits,
        roiRatio,
        paybackMonths,
        npv
    });
}

/**
 * Calculate a significantly improved scaled investment cost based on company revenue
 * Uses a combination of percentage-based and tiered scaling for more realistic costs
 * @param {number} revenue - Annual revenue
 * @returns {number} - Scaled investment cost
 */
function improvedScaledInvestment(revenue) {
    // Base investment for small companies ($250,000)
    const baseInvestment = 250000;
    
    // For companies with less than $100M revenue, use the base investment
    // but ensure it's at least 0.25% of revenue
    if (revenue <= 100000000) {
        return Math.max(baseInvestment, revenue * 0.0025);
    }
    
    // For larger companies, use a percentage of revenue with minimum thresholds
    // $100M-$1B: at least 0.25% of revenue or higher calculated amount
    // $1B-$10B: at least 0.20% of revenue or higher calculated amount
    // $10B+: at least 0.15% of revenue or higher calculated amount
    
    if (revenue <= 1000000000) { // $100M to $1B
        return Math.max(
            revenue * 0.0025, // At least 0.25% of revenue
            baseInvestment * (2.0 + (Math.log10(revenue / 100000000) * 2.0))
        );
    } 
    else if (revenue <= 10000000000) { // $1B to $10B
        return Math.max(
            revenue * 0.002, // At least 0.20% of revenue
            baseInvestment * (4.0 + (Math.log10(revenue / 1000000000) * 6.0))
        );
    }
    else { // Above $10B
        return Math.max(
            revenue * 0.0015, // At least 0.15% of revenue
            baseInvestment * (10.0 + (Math.log10(revenue / 10000000000) * 10.0))
        );
    }
}

/**
 * Calculate benefits for a specific year with improved scaling for large companies
 * @param {number} year - Year number (1, 2, or 3)
 * @param {object} industry - Industry parameters
 * @param {object} maturity - Maturity level parameters
 * @param {number} revenue - Annual revenue
 * @param {number} procurementSpend - Annual procurement spend
 * @param {number} supplyChainEmissions - Supply chain emissions in kg CO2e
 * @param {number} carbonPrice - Carbon price per ton
 * @returns {object} - Calculated benefits
 */
function calculateYearlyBenefits(year, industry, maturity, revenue, procurementSpend, supplyChainEmissions, carbonPrice) {
    // Add annual growth rate for years 2-3
    const growthMultiplier = year > 1 ? Math.pow(1.03, year - 1) : 1;
    
    // Calculate procurement cost savings with diminishing returns for very large companies
    const procurementSavingsBase = procurementSpend * industry.averageSavingsPercent;
    const procurementScalingFactor = revenue > 1000000000 ? 
        1.0 - (Math.log10(revenue / 1000000000) * 0.1) : 1.0;
    const procurementSavings = procurementSavingsBase * 
        Math.max(0.5, procurementScalingFactor) * 
        maturity.savingsMultiplier * 
        growthMultiplier;
    
    // Calculate carbon value impact
    let carbonReductionPercent;
    if (year === 1) carbonReductionPercent = carbonReduction.year1;
    else if (year === 2) carbonReductionPercent = carbonReduction.year2;
    else carbonReductionPercent = carbonReduction.year3;
    
    // Convert kg to metric tons for carbon price calculation
    const supplyChainEmissionsInTons = supplyChainEmissions / 1000;
    const carbonValueImpact = supplyChainEmissionsInTons * carbonPrice * carbonReductionPercent;
    
    // Calculate risk mitigation value with improved scaling
    const baseRiskValue = riskValues[industry.riskLevel];
    
    // Apply more reasonable revenue scaling with improved logarithmic approach
    const revenueScale = improvedRiskRevenueScale(revenue);
    
    // Calculate revenue-based component with stronger diminishing returns
    const revenuePercentFactor = revenue > 1000000000 ? 
        0.0002 * (1.0 - (Math.log10(revenue / 1000000000) * 0.12)) : 
        0.0002;
    
    const revenuePercentComponent = revenue * 
        Math.max(0.00005, revenuePercentFactor) * 
        (industry.riskLevel === "high" ? 1.0 : industry.riskLevel === "medium" ? 0.6 : 0.3);
    
    // Calculate the total risk mitigation value with both components
    const riskMitigationValue = (baseRiskValue * revenueScale * maturity.riskReductionMultiplier * growthMultiplier) + 
                               (revenuePercentComponent * maturity.riskReductionMultiplier * growthMultiplier);
    
    // Calculate brand value with stronger diminishing returns for larger companies
    let brandValuePercent;
    if (year === 1) brandValuePercent = brandValueIncrease.year1;
    else if (year === 2) brandValuePercent = brandValueIncrease.year2;
    else brandValuePercent = brandValueIncrease.year3;
    
    // Apply stronger diminishing returns for brand value impact as company size increases
    const brandScalingFactor = revenue > 1000000000 ? 
        brandValuePercent * (1.0 - (Math.log10(revenue / 1000000000) * 0.07)) : 
        brandValuePercent;
    
    const brandValueImpact = revenue * Math.max(brandValuePercent * 0.25, brandScalingFactor);
    
    // Calculate total benefits
    const total = procurementSavings + carbonValueImpact + riskMitigationValue + brandValueImpact;
    
    return {
        procurementSavings,
        carbonValueImpact,
        riskMitigationValue,
        brandValueImpact,
        total
    };
}

/**
 * Calculate the risk revenue scale using an improved logarithmic approach
 * @param {number} revenue - Annual revenue
 * @returns {number} - Calculated revenue scale factor
 */
function improvedRiskRevenueScale(revenue) {
    // Use logarithmic scaling for smoother progression
    if (revenue <= 100000000) { // Up to $100M
        return Math.max(0.5, revenue / 100000000);
    }
    else if (revenue <= 1000000000) { // $100M to $1B
        return 1.0 + Math.log10(revenue / 100000000) * 0.75;
    }
    else if (revenue <= 10000000000) { // $1B to $10B
        return 1.75 + Math.log10(revenue / 1000000000) * 0.75;
    }
    else { // Above $10B
        return 2.5 + Math.log10(revenue / 10000000000) * 0.5;
    }
}

/**
 * Helper function to determine top benefit area
 * @param {object} results - Calculation results
 * @returns {string} - Top benefit area name
 */
function getTopBenefitArea(results) {
    const year1Benefits = results.benefits.year1;
    const areas = [
        { name: 'procurement cost savings', value: year1Benefits.procurementSavings },
        { name: 'carbon value impact', value: year1Benefits.carbonValueImpact },
        { name: 'risk mitigation', value: year1Benefits.riskMitigationValue },
        { name: 'brand value', value: year1Benefits.brandValueImpact }
    ];
    
    // Sort by value (highest first)
    areas.sort((a, b) => b.value - a.value);
    
    return areas[0].name;
}