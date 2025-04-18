/**
 * Core Calculator Logic
 * Handles ROI calculations based on user inputs
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
    
    // Set service investment based on user input or defaults
    const serviceInvestment = { ...defaultServiceInvestment };
    if (customInvestment) {
        serviceInvestment.year1 = customInvestment;
        serviceInvestment.year2 = customInvestment * 1.1; // 10% increase year 2
        serviceInvestment.year3 = customInvestment * 1.16; // 16% increase year 3
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
 * Calculate benefits for a specific year
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
    
    // Calculate procurement cost savings
    const procurementSavings = procurementSpend * industry.averageSavingsPercent * maturity.savingsMultiplier * growthMultiplier;
    
    // Calculate carbon value impact
    let carbonReductionPercent;
    if (year === 1) carbonReductionPercent = carbonReduction.year1;
    else if (year === 2) carbonReductionPercent = carbonReduction.year2;
    else carbonReductionPercent = carbonReduction.year3;
    
    // Convert kg to metric tons for carbon price calculation
    const supplyChainEmissionsInTons = supplyChainEmissions / 1000;
    const carbonValueImpact = supplyChainEmissionsInTons * carbonPrice * carbonReductionPercent;
    
    // Calculate risk mitigation value - scale based on company size
    const baseRiskValue = riskValues[industry.riskLevel];
    
    // Apply improved revenue scaling with tiered approach
    const revenueScale = calculateRiskRevenueScale(revenue);
    
    // Calculate revenue-based component
    const revenuePercentComponent = revenue * 0.0002 * (industry.riskLevel === "high" ? 1.0 : industry.riskLevel === "medium" ? 0.6 : 0.3);
    
    // Calculate the total risk mitigation value with both components
    const riskMitigationValue = (baseRiskValue * revenueScale * maturity.riskReductionMultiplier * growthMultiplier) + 
                               (revenuePercentComponent * maturity.riskReductionMultiplier * growthMultiplier);
    
    // Calculate brand value / market access impact
    let brandValuePercent;
    if (year === 1) brandValuePercent = brandValueIncrease.year1;
    else if (year === 2) brandValuePercent = brandValueIncrease.year2;
    else brandValuePercent = brandValueIncrease.year3;
    
    const brandValueImpact = revenue * brandValuePercent;
    
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
 * Calculate the risk revenue scale using a tiered approach
 * @param {number} revenue - Annual revenue
 * @returns {number} - Calculated revenue scale factor
 */
function calculateRiskRevenueScale(revenue) {
  // Base value for companies up to $100M
  if (revenue <= 100000000) {
    return Math.max(0.5, revenue / 100000000);
  }
  // Scale for companies between $100M and $1B
  else if (revenue <= 1000000000) {
    return 1.0 + (revenue - 100000000) / 900000000 * 1.0;
  }
  // Scale for companies between $1B and $10B
  else if (revenue <= 10000000000) {
    return 2.0 + (revenue - 1000000000) / 9000000000 * 3.0;
  }
  // Scale for companies above $10B
  else {
    return 5.0 + (Math.min(revenue, 100000000000) - 10000000000) / 90000000000 * 5.0;
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