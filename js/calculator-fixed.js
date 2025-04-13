/**
 * Core Calculator Logic (Fixed Version)
 * Handles ROI calculations based on user inputs, with proper scaling for large companies
 */

// Store for saved scenarios
const savedScenarios = [];

// Currency formatter for displaying monetary values
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 1,
    notation: 'compact',
    compactDisplay: 'short'
});

/**
 * Main calculation function that computes ROI metrics
 */
function calculateROI() {
    // Get input values from form
    const industryCode = document.getElementById('industry').value;
    const revenue = parseFloat(document.getElementById('revenue').value) * 1000000; // Convert M to actual dollars
    const supplierCount = document.getElementById('suppliers').value ? parseInt(document.getElementById('suppliers').value) : null;
    let procurementSpend = document.getElementById('procurement').value ? parseFloat(document.getElementById('procurement').value) * 1000000 : null; // Convert M to actual dollars
    const carbonPrice = parseFloat(document.getElementById('carbon-price').value);
    const maturityCode = document.getElementById('maturity').value;
    const customInvestment = document.getElementById('investment').value ? parseFloat(document.getElementById('investment').value) * 1000000 : null; // Convert M to actual dollars
    
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
        // Scale investment based on company size using logarithmic scaling
        const baseInvestment = calculateScaledInvestment(revenue);
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
 * Calculate a scaled investment cost based on company revenue
 * Uses logarithmic scaling to avoid linear growth with revenue
 * @param {number} revenue - Annual revenue
 * @returns {number} - Scaled investment cost
 */
function calculateScaledInvestment(revenue) {
    // Base investment for small-medium companies ($250,000)
    const baseInvestment = 250000;
    
    // For companies with less than $50M revenue, use the base investment
    if (revenue <= 50000000) {
        return baseInvestment;
    }
    
    // For larger companies, scale logarithmically with more aggressive scaling for large enterprises
    // This creates more realistic investment costs that better reflect market rates
    // Revenue tiers with updated scaling:
    // $50M-$250M: 1.0x to 2.0x base  
    // $250M-$1B: 2.0x to 3.5x base
    // $1B-$5B: 3.5x to 6.0x base
    // $5B-$20B: 6.0x to 9.0x base
    // $20B+: 9.0x to 12.0x base
    
    if (revenue <= 250000000) { // $50M to $250M
        const scaleFactor = 1.0 + (Math.log(revenue / 50000000) / Math.log(5)) * 1.0;
        return baseInvestment * scaleFactor;
    } 
    else if (revenue <= 1000000000) { // $250M to $1B
        const scaleFactor = 2.0 + (Math.log(revenue / 250000000) / Math.log(4)) * 1.5;
        return baseInvestment * scaleFactor;
    }
    else if (revenue <= 5000000000) { // $1B to $5B
        const scaleFactor = 3.5 + (Math.log(revenue / 1000000000) / Math.log(5)) * 2.5;
        return baseInvestment * scaleFactor;
    }
    else if (revenue <= 20000000000) { // $5B to $20B
        const scaleFactor = 6.0 + (Math.log(revenue / 5000000000) / Math.log(4)) * 3.0;
        return baseInvestment * scaleFactor;
    }
    else { // Above $20B
        const scaleFactor = 9.0 + (Math.log(revenue / 20000000000) / Math.log(10)) * 3.0;
        // Cap at 12x for extremely large companies
        return baseInvestment * Math.min(12.0, scaleFactor);
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
    // Convert risk values from millions to actual dollars
    const baseRiskValue = riskValues[industry.riskLevel] * 1000000;
    
    // Apply more reasonable revenue scaling with improved logarithmic approach
    const revenueScale = calculateRiskRevenueScale(revenue);
    
    // Calculate revenue-based component with diminishing returns
    const revenuePercentFactor = revenue > 1000000000 ? 
        0.0002 * (1.0 - (Math.log10(revenue / 1000000000) * 0.1)) : 
        0.0002;
    
    const revenuePercentComponent = revenue * 
        Math.max(0.00005, revenuePercentFactor) * 
        (industry.riskLevel === "high" ? 1.0 : industry.riskLevel === "medium" ? 0.6 : 0.3);
    
    // Calculate the total risk mitigation value with both components
    const riskMitigationValue = (baseRiskValue * revenueScale * maturity.riskReductionMultiplier * growthMultiplier) + 
                               (revenuePercentComponent * maturity.riskReductionMultiplier * growthMultiplier);
    
    // Calculate brand value with diminishing returns for larger companies
    let brandValuePercent;
    if (year === 1) brandValuePercent = brandValueIncrease.year1;
    else if (year === 2) brandValuePercent = brandValueIncrease.year2;
    else brandValuePercent = brandValueIncrease.year3;
    
    // Apply diminishing returns for brand value impact as company size increases
    const brandScalingFactor = revenue > 1000000000 ? 
        brandValuePercent * (1.0 - (Math.log10(revenue / 1000000000) * 0.05)) : 
        brandValuePercent;
    
    const brandValueImpact = revenue * Math.max(brandValuePercent * 0.3, brandScalingFactor);
    
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
function calculateRiskRevenueScale(revenue) {
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