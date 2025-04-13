/**
 * Industry Parameters and Reference Data
 * Based on EPA USEEIO Supply Chain GHG Emission Factors (v1.3.0)
 */

// Industry parameters with emission factors and procurement percentages
const industryParameters = {
    sector11: {
        name: "Agriculture, Forestry, Fishing and Hunting (NAICS 11)",
        procurementPercent: 0.60,
        emissionFactor: 1.12, // kg CO2e per USD
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector21: {
        name: "Mining, Quarrying, and Oil and Gas Extraction (NAICS 21)",
        procurementPercent: 0.55,
        emissionFactor: 1.25,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector22: {
        name: "Utilities (NAICS 22)",
        procurementPercent: 0.50,
        emissionFactor: 0.85,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector23: {
        name: "Construction (NAICS 23)",
        procurementPercent: 0.65,
        emissionFactor: 0.72,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector31: {
        name: "Manufacturing (Part 1) (NAICS 31)",
        procurementPercent: 0.58,
        emissionFactor: 0.95,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector32: {
        name: "Manufacturing (Part 2) (NAICS 32)",
        procurementPercent: 0.68,
        emissionFactor: 1.35,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector33: {
        name: "Manufacturing (Part 3) (NAICS 33)",
        procurementPercent: 0.65,
        emissionFactor: 1.05,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector42: {
        name: "Wholesale Trade (NAICS 42)",
        procurementPercent: 0.45,
        emissionFactor: 0.79,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector44: {
        name: "Retail Trade (Part 1) (NAICS 44)",
        procurementPercent: 0.70,
        emissionFactor: 0.65,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector45: {
        name: "Retail Trade (Part 2) (NAICS 45)",
        procurementPercent: 0.70,
        emissionFactor: 0.38,
        averageSavingsPercent: 0.012,
        riskLevel: "medium"
    },
    sector48: {
        name: "Transportation and Warehousing (Part 1) (NAICS 48)",
        procurementPercent: 0.42,
        emissionFactor: 1.32,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector49: {
        name: "Transportation and Warehousing (Part 2) (NAICS 49)",
        procurementPercent: 0.40,
        emissionFactor: 0.39,
        averageSavingsPercent: 0.012,
        riskLevel: "medium"
    },
    sector51: {
        name: "Information (NAICS 51)",
        procurementPercent: 0.35,
        emissionFactor: 0.32,
        averageSavingsPercent: 0.012,
        riskLevel: "medium"
    },
    sector52: {
        name: "Finance and Insurance (NAICS 52)",
        procurementPercent: 0.30,
        emissionFactor: 0.47,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector53: {
        name: "Real Estate and Rental and Leasing (NAICS 53)",
        procurementPercent: 0.25,
        emissionFactor: 0.65,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector54: {
        name: "Professional, Scientific, and Technical Services (NAICS 54)",
        procurementPercent: 0.40,
        emissionFactor: 0.68,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector55: {
        name: "Management of Companies and Enterprises (NAICS 55)",
        procurementPercent: 0.35,
        emissionFactor: 0.25,
        averageSavingsPercent: 0.010,
        riskLevel: "medium"
    },
    sector56: {
        name: "Administrative and Support Services (NAICS 56)",
        procurementPercent: 0.45,
        emissionFactor: 1.42,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector61: {
        name: "Educational Services (NAICS 61)",
        procurementPercent: 0.30,
        emissionFactor: 0.42,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector62: {
        name: "Health Care and Social Assistance (NAICS 62)",
        procurementPercent: 0.35,
        emissionFactor: 0.82,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector71: {
        name: "Arts, Entertainment, and Recreation (NAICS 71)",
        procurementPercent: 0.40,
        emissionFactor: 0.72,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector72: {
        name: "Accommodation and Food Services (NAICS 72)",
        procurementPercent: 0.55,
        emissionFactor: 0.63,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    },
    sector81: {
        name: "Other Services (NAICS 81)",
        procurementPercent: 0.40,
        emissionFactor: 0.72,
        averageSavingsPercent: 0.015,
        riskLevel: "high"
    }
};

// Maturity level definitions and multipliers
const maturityLevels = {
    beginning: {
        description: "Just starting sustainability initiatives, minimal supplier engagement",
        savingsMultiplier: 1.0,
        riskReductionMultiplier: 1.0
    },
    developing: {
        description: "Some processes in place, early supplier assessment",
        savingsMultiplier: 0.8,
        riskReductionMultiplier: 0.8
    },
    established: {
        description: "Formal program established, regular supplier assessment",
        savingsMultiplier: 0.6,
        riskReductionMultiplier: 0.6
    },
    advanced: {
        description: "Comprehensive program, deep supplier engagement",
        savingsMultiplier: 0.4,
        riskReductionMultiplier: 0.4
    },
    leading: {
        description: "Industry-leading program, full supply chain visibility",
        savingsMultiplier: 0.3,
        riskReductionMultiplier: 0.3
    }
};

// Risk baseline values by risk level - adjusted to be more proportional to other benefits
// and scale with company size
const riskValues = {
    high: 250000,   // Was 1000000
    medium: 150000, // Was 850000
    low: 100000     // Was 500000
};

// Default service investment costs
const defaultServiceInvestment = {
    year1: 250000,
    year2: 275000,
    year3: 290000
};

// Carbon reduction percentages by year
const carbonReduction = {
    year1: 0.15,
    year2: 0.195,
    year3: 0.254
};

// Brand value increase by year
const brandValueIncrease = {
    year1: 0.001,
    year2: 0.0015,
    year3: 0.002
};
