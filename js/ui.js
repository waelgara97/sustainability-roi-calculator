/**
 * UI Functions for the ROI Calculator
 * Handles display of results and user interactions
 */

/**
 * Display calculation results in the UI
 * @param {object} results - The calculation results
 */
function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    
    // Format values in millions
    const formatMillions = (value) => {
        const inMillions = value / 1000000;
        return `$${inMillions.toFixed(2)}M`;
    };
    
    // Determine color based on ROI value
    const getMetricColor = (roi) => {
        if (roi >= 3) return "#0e7c61"; // Excellent - green
        if (roi >= 2) return "#4eb38f"; // Very good - light green
        if (roi >= 1.5) return "#ffc107"; // Good - yellow
        return "#dc3545"; // Needs improvement - red
    };
    
    const roiColor = getMetricColor(results.roiRatio);
    
    // Generate recommendations based on results
    let recommendations = '';
    
    if (results.roiRatio >= 3) {
        recommendations = `<strong>Strong Business Case:</strong> With an ROI of ${results.roiRatio.toFixed(2)}x, your organization has a compelling business case for sustainability rating services. The potential financial benefits significantly outweigh the investment costs. Consider a comprehensive implementation approach focused on all benefit categories, with special emphasis on your strongest area: ${getTopBenefitArea(results)}.`;
    } else if (results.roiRatio >= 2) {
        recommendations = `<strong>Positive Business Case:</strong> With an ROI of ${results.roiRatio.toFixed(2)}x, sustainability rating services would deliver solid value for your organization. Focus initial efforts on your highest-value opportunity area: ${getTopBenefitArea(results)}. Consider a phased implementation approach to maximize early returns.`;
    } else if (results.roiRatio >= 1) {
        recommendations = `<strong>Moderate Business Case:</strong> With an ROI of ${results.roiRatio.toFixed(2)}x, sustainability rating services offer positive returns, but careful implementation planning is recommended. Start with targeted initiatives in ${getTopBenefitArea(results)} to build momentum, and consider adjusting your sustainability maturity approach to increase potential savings.`;
    } else {
        recommendations = `<strong>Limited Business Case:</strong> With the current parameters, your ROI is below 1.0x. Consider focusing on specific high-value areas like ${getTopBenefitArea(results)}, adjusting your implementation timeline, or investigating industry-specific sustainability programs with lower initial costs. Reassess as your sustainability maturity increases.`;
    }
    
    // Generate HTML for results display with tabs for different ROI views
    const html = `
        <div class="roi-tabs">
            <div class="roi-tab-navigation">
                <button id="overall-roi-tab" class="roi-tab active">Overall ROI</button>
                <button id="procurement-roi-tab" class="roi-tab">Procurement ROI</button>
            </div>
            
            <div id="overall-roi-container" class="roi-tab-content">
                <div class="results-summary">
                    <h3>Financial Summary</h3>
                    <div class="metric" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div style="width: 60%;">
                            <span class="metric-name" style="font-size: 18px; font-weight: bold;">3-Year ROI Ratio:</span>
                            <div style="font-size: 36px; font-weight: bold; color: ${roiColor};">${results.roiRatio.toFixed(2)}x</div>
                            <span style="font-size: 14px; color: #666;">Return per dollar invested</span>
                        </div>
                        <div style="width: 40%; text-align: right;">
                            <div class="metric">
                                <span class="metric-name">Net Benefits:</span>
                                <span class="metric-value">${formatMillions(results.netBenefits)}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">Payback Period:</span>
                                <span class="metric-value">${results.paybackMonths} months</span>
                            </div>
                            <div class="metric">
                                <span class="metric-name">NPV (10% discount):</span>
                                <span class="metric-value">${formatMillions(results.npv)}</span>
                            </div>
                        </div>
                    </div>
                    <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
                        <p style="margin: 0;"><strong>Industry:</strong> ${results.industry.name} | <strong>Maturity Level:</strong> ${document.getElementById('maturity').value.charAt(0).toUpperCase() + document.getElementById('maturity').value.slice(1)}</p>
                    </div>
                </div>
                
                <div class="benefits-table">
                    <h3>Benefits Breakdown</h3>
                    <p style="margin-bottom: 15px;">Summary of financial benefits by category over the 3-year period (in millions)</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Benefit Category</th>
                                <th>Year 1</th>
                                <th>Year 2</th>
                                <th>Year 3</th>
                                <th>3-Year Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Procurement Cost Savings</td>
                                <td>${formatMillions(results.benefits.year1.procurementSavings)}</td>
                                <td>${formatMillions(results.benefits.year2.procurementSavings)}</td>
                                <td>${formatMillions(results.benefits.year3.procurementSavings)}</td>
                                <td>${formatMillions(
                                    results.benefits.year1.procurementSavings + 
                                    results.benefits.year2.procurementSavings + 
                                    results.benefits.year3.procurementSavings
                                )}</td>
                            </tr>
                            <tr>
                                <td>Carbon Value Impact</td>
                                <td>${formatMillions(results.benefits.year1.carbonValueImpact)}</td>
                                <td>${formatMillions(results.benefits.year2.carbonValueImpact)}</td>
                                <td>${formatMillions(results.benefits.year3.carbonValueImpact)}</td>
                                <td>${formatMillions(
                                    results.benefits.year1.carbonValueImpact + 
                                    results.benefits.year2.carbonValueImpact + 
                                    results.benefits.year3.carbonValueImpact
                                )}</td>
                            </tr>
                            <tr>
                                <td>Risk Mitigation Value</td>
                                <td>${formatMillions(results.benefits.year1.riskMitigationValue)}</td>
                                <td>${formatMillions(results.benefits.year2.riskMitigationValue)}</td>
                                <td>${formatMillions(results.benefits.year3.riskMitigationValue)}</td>
                                <td>${formatMillions(
                                    results.benefits.year1.riskMitigationValue + 
                                    results.benefits.year2.riskMitigationValue + 
                                    results.benefits.year3.riskMitigationValue
                                )}</td>
                            </tr>
                            <tr>
                                <td>Brand Value / Market Access</td>
                                <td>${formatMillions(results.benefits.year1.brandValueImpact)}</td>
                                <td>${formatMillions(results.benefits.year2.brandValueImpact)}</td>
                                <td>${formatMillions(results.benefits.year3.brandValueImpact)}</td>
                                <td>${formatMillions(
                                    results.benefits.year1.brandValueImpact + 
                                    results.benefits.year2.brandValueImpact + 
                                    results.benefits.year3.brandValueImpact
                                )}</td>
                            </tr>
                            <tr class="total-row">
                                <td>Total Benefits</td>
                                <td>${formatMillions(results.benefits.year1.total)}</td>
                                <td>${formatMillions(results.benefits.year2.total)}</td>
                                <td>${formatMillions(results.benefits.year3.total)}</td>
                                <td>${formatMillions(
                                    results.benefits.year1.total + 
                                    results.benefits.year2.total + 
                                    results.benefits.year3.total
                                )}</td>
                            </tr>
                            <tr>
                                <td>Investment Cost</td>
                                <td>${formatMillions(results.serviceInvestment.year1)}</td>
                                <td>${formatMillions(results.serviceInvestment.year2)}</td>
                                <td>${formatMillions(results.serviceInvestment.year3)}</td>
                                <td>${formatMillions(
                                    results.serviceInvestment.year1 + 
                                    results.serviceInvestment.year2 + 
                                    results.serviceInvestment.year3
                                )}</td>
                            </tr>
                            <tr class="total-row">
                                <td>Net Benefits</td>
                                <td>${formatMillions(results.benefits.year1.total - results.serviceInvestment.year1)}</td>
                                <td>${formatMillions(results.benefits.year2.total - results.serviceInvestment.year2)}</td>
                                <td>${formatMillions(results.benefits.year3.total - results.serviceInvestment.year3)}</td>
                                <td>${formatMillions(results.netBenefits)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <h3>Visualizations</h3>
                    <div class="chart-tabs">
                        <button id="benefits-tab" class="chart-tab active">Benefits Breakdown</button>
                        <button id="cashflow-tab" class="chart-tab">Cumulative Cash Flow</button>
                        <button id="emissions-tab" class="chart-tab">Emissions Impact</button>
                        <a href="methodology.html" class="chart-tab methodology-link" target="_blank">Calculation Methodology</a>
                    </div>
                    
                    <div id="benefits-chart-container" class="chart-container">
                        <canvas id="benefitsChart"></canvas>
                    </div>
                    
                    <div id="cashflow-chart-container" class="chart-container" style="display: none;">
                        <canvas id="cashFlowChart"></canvas>
                    </div>
                    
                    <div id="emissions-chart-container" class="chart-container" style="display: none;">
                        <canvas id="emissionsChart"></canvas>
                    </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <h3>Recommendations</h3>
                    <p id="recommendations">${recommendations}</p>
                </div>
                
                <div style="margin-top: 20px; text-align: right;">
                    <button id="export-overall-btn" class="export-btn" style="background-color: #6c757d;">
                        <span style="display: inline-block; margin-right: 5px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            </svg>
                        </span>
                        Export Results as PDF
                    </button>
                </div>
            </div>
            
            <div id="procurement-roi-container" class="roi-tab-content" style="display: none;">
                <!-- This will be populated by the procurement ROI calculator -->
                <p>Loading procurement-specific ROI analysis...</p>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
    
    // Set up ROI tab functionality
    document.getElementById('overall-roi-tab').addEventListener('click', function() {
        document.getElementById('overall-roi-container').style.display = 'block';
        document.getElementById('procurement-roi-container').style.display = 'none';
        this.classList.add('active');
        document.getElementById('procurement-roi-tab').classList.remove('active');
    });
    
    document.getElementById('procurement-roi-tab').addEventListener('click', function() {
        document.getElementById('overall-roi-container').style.display = 'none';
        document.getElementById('procurement-roi-container').style.display = 'block';
        this.classList.add('active');
        document.getElementById('overall-roi-tab').classList.remove('active');
        
        // Display procurement ROI analysis
        displayProcurementROI(results);
    });
    
    // Add event listeners for the chart tabs and export button
    document.getElementById('benefits-tab').addEventListener('click', function() {
        hideAllCharts();
        this.classList.add('active');
        document.getElementById('benefits-chart-container').style.display = 'block';
    });
    
    document.getElementById('cashflow-tab').addEventListener('click', function() {
        hideAllCharts();
        this.classList.add('active');
        document.getElementById('cashflow-chart-container').style.display = 'block';
    });
    
    document.getElementById('emissions-tab').addEventListener('click', function() {
        hideAllCharts();
        this.classList.add('active');
        document.getElementById('emissions-chart-container').style.display = 'block';
    });
    
    // Helper function to hide all charts and remove active class from tabs
    function hideAllCharts() {
        // Hide all chart containers
        document.querySelectorAll('.chart-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.chart-tab:not(.methodology-link)').forEach(tab => {
            tab.classList.remove('active');
        });
    }
    
    // Set up PDF export functionality for overall ROI
    document.getElementById('export-overall-btn').addEventListener('click', function() {
        // Prepare data for overall ROI PDF export
        const companyData = {
            industry: results.industry.name,
            revenue: formatMillions(results.revenue),
            maturity: document.getElementById('maturity').value.charAt(0).toUpperCase() + document.getElementById('maturity').value.slice(1),
            roiRatio: results.roiRatio.toFixed(2),
            netBenefits: formatMillions(results.netBenefits),
            paybackMonths: results.paybackMonths,
            npv: formatMillions(results.npv)
        };
        
        // Generate PDF
        generatePDF(companyData, results.benefits, results.serviceInvestment);
    });
    
    // Create charts with values in millions
    createCharts({
        benefits: results.benefits,
        serviceInvestment: results.serviceInvestment,
        supplyChainEmissions: results.supplyChainEmissions,
        carbonPrice: parseFloat(document.getElementById('carbon-price').value)
    });
}

/**
 * Create charts for visualizing the results
 * @param {object} data - The data for the charts
 */
function createCharts(data) {
    // Convert values to millions for better chart display
    const toMillions = (value) => value / 1000000;
    
    // Benefits Breakdown Chart
    const benefitsCtx = document.getElementById('benefitsChart').getContext('2d');
    
    new Chart(benefitsCtx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [
                {
                    label: 'Procurement Cost Savings',
                    data: [
                        toMillions(data.benefits.year1.procurementSavings),
                        toMillions(data.benefits.year2.procurementSavings),
                        toMillions(data.benefits.year3.procurementSavings)
                    ],
                    backgroundColor: '#4eb38f',
                },
                {
                    label: 'Carbon Value Impact',
                    data: [
                        toMillions(data.benefits.year1.carbonValueImpact),
                        toMillions(data.benefits.year2.carbonValueImpact),
                        toMillions(data.benefits.year3.carbonValueImpact)
                    ],
                    backgroundColor: '#0e7c61',
                },
                {
                    label: 'Risk Mitigation Value',
                    data: [
                        toMillions(data.benefits.year1.riskMitigationValue),
                        toMillions(data.benefits.year2.riskMitigationValue),
                        toMillions(data.benefits.year3.riskMitigationValue)
                    ],
                    backgroundColor: '#ffc107',
                },
                {
                    label: 'Brand Value / Market Access',
                    data: [
                        toMillions(data.benefits.year1.brandValueImpact),
                        toMillions(data.benefits.year2.brandValueImpact),
                        toMillions(data.benefits.year3.brandValueImpact)
                    ],
                    backgroundColor: '#6c757d',
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Benefits Breakdown by Category and Year (in millions)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += `$${context.parsed.y.toFixed(2)}M`;
                            }
                            return label;
                        }
                    }
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return `$${value.toFixed(1)}M`;
                        },
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: 'USD (Millions)'
                    }
                }
            }
        }
    });
    
    // Cumulative Cash Flow Chart
    const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d');
    
    const netCashFlowYear1 = data.benefits.year1.total - data.serviceInvestment.year1;
    const netCashFlowYear2 = data.benefits.year2.total - data.serviceInvestment.year2;
    const netCashFlowYear3 = data.benefits.year3.total - data.serviceInvestment.year3;
    
    const cumulativeCashFlow = [
        -data.serviceInvestment.year1,
        -data.serviceInvestment.year1 + data.benefits.year1.total,
        -data.serviceInvestment.year1 + data.benefits.year1.total - data.serviceInvestment.year2 + data.benefits.year2.total,
        -data.serviceInvestment.year1 + data.benefits.year1.total - data.serviceInvestment.year2 + data.benefits.year2.total - data.serviceInvestment.year3 + data.benefits.year3.total
    ];
    
    // Convert to millions
    const cumulativeCashFlowInMillions = cumulativeCashFlow.map(value => toMillions(value));
    
    new Chart(cashFlowCtx, {
        type: 'line',
        data: {
            labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
            datasets: [{
                label: 'Cumulative Cash Flow',
                data: cumulativeCashFlowInMillions,
                borderColor: '#0e7c61',
                backgroundColor: 'rgba(14, 124, 97, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cumulative Cash Flow (in millions)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += `$${context.parsed.y.toFixed(2)}M`;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return `$${value.toFixed(1)}M`;
                        }
                    },
                    title: {
                        display: true,
                        text: 'USD (Millions)'
                    }
                }
            }
        }
    });
    
    // Emissions Impact Chart 
    const emissionsCtx = document.getElementById('emissionsChart').getContext('2d');
    
    // Calculate emission reductions
    const carbonReduction = {
        year1: 0.15,
        year2: 0.195,
        year3: 0.254
    };
    
    // Convert kg to metric tons
    const emissionsInTons = data.supplyChainEmissions / 1000;
    
    const baselineEmissions = [emissionsInTons, emissionsInTons, emissionsInTons];
    const reducedEmissions = [
        emissionsInTons * (1 - carbonReduction.year1),
        emissionsInTons * (1 - carbonReduction.year2),
        emissionsInTons * (1 - carbonReduction.year3)
    ];
    
    const emissionsSavings = [
        emissionsInTons * carbonReduction.year1,
        emissionsInTons * carbonReduction.year2,
        emissionsInTons * carbonReduction.year3
    ];
    
    new Chart(emissionsCtx, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [
                {
                    label: 'Baseline Emissions',
                    data: baselineEmissions,
                    backgroundColor: 'rgba(108, 117, 125, 0.2)', // Light gray
                    borderColor: 'rgba(108, 117, 125, 1)',
                    borderWidth: 1,
                    type: 'line',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    borderDash: [5, 5]
                },
                {
                    label: 'Emissions After Reduction',
                    data: reducedEmissions,
                    backgroundColor: '#4eb38f', // Green
                    borderColor: '#4eb38f',
                    borderWidth: 1
                },
                {
                    label: 'Emissions Savings',
                    data: emissionsSavings,
                    backgroundColor: '#0e7c61', // Dark green
                    borderColor: '#0e7c61',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Carbon Emissions Impact (Metric Tons CO2e)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                const value = context.parsed.y;
                                label += `${Math.round(value).toLocaleString()} tCO2e`;
                                
                                // Add carbon price value for emissions savings
                                if (context.datasetIndex === 2) {
                                    const carbonValue = value * data.carbonPrice;
                                    label += ` ($${(carbonValue/1000000).toFixed(2)}M)`;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return Math.round(value).toLocaleString() + ' tCO2e';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Metric Tons CO2e'
                    }
                }
            }
        }
    });
}

/**
 * Document ready function to set up UI event handlers
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to form submission
    document.getElementById('roi-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading spinner
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results-container').innerHTML = '';
        
        try {
            // Perform calculation directly without setTimeout
            // This avoids potential timing issues
            calculateROI();
            
            // Hide loading spinner
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            // Error handling for calculation issues
            console.error("Calculation error:", error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('results-container').innerHTML = `
                <div style="padding: 20px; background-color: #f8d7da; border-radius: 4px; color: #721c24;">
                    <h3>Error in Calculation</h3>
                    <p>Sorry, an error occurred during the calculation. Please check your inputs and try again.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    });
    
    // Reset button functionality
    document.getElementById('reset-btn').addEventListener('click', function() {
        document.getElementById('roi-form').reset();
        document.getElementById('results-container').innerHTML = '<p>Enter your information and click "Calculate ROI" to see results.</p>';
    });
    
    // Auto-calculate procurement spend when revenue changes
    document.getElementById('revenue').addEventListener('input', function() {
        const industryCode = document.getElementById('industry').value;
        const revenue = parseFloat(this.value);
        
        if (industryCode && revenue) {
            const industry = industryParameters[industryCode];
            const procurementSpend = revenue * industry.procurementPercent;
            document.getElementById('procurement').placeholder = `Calculated: $${procurementSpend.toFixed(2)}M`;
        }
    });
    
    // Update procurement placeholder when industry changes
    document.getElementById('industry').addEventListener('change', function() {
        const revenue = parseFloat(document.getElementById('revenue').value);
        const industryCode = this.value;
        
        if (industryCode && revenue) {
            const industry = industryParameters[industryCode];
            const procurementSpend = revenue * industry.procurementPercent;
            document.getElementById('procurement').placeholder = `Calculated: $${procurementSpend.toFixed(2)}M`;
        }
    });
    
    // Add event listener to Save Scenario button
    document.getElementById('save-scenario').addEventListener('click', function() {
        const industryCode = document.getElementById('industry').value;
        const revenue = document.getElementById('revenue').value;
        const suppliers = document.getElementById('suppliers').value;
        const procurement = document.getElementById('procurement').value;
        const carbonPrice = document.getElementById('carbon-price').value;
        const maturityCode = document.getElementById('maturity').value;
        const investment = document.getElementById('investment').value;
        
        // Validate at least industry and revenue are provided
        if (!industryCode || !revenue) {
            alert("Please enter at least Industry and Revenue to save a scenario");
            return;
        }
        
        // Create a unique name for the scenario
        const industry = industryParameters[industryCode];
        const scenarioName = `${industry.name} - $${revenue}M Revenue`;
        
        // Store the scenario data
        const scenarioData = {
            id: Date.now(), // Unique ID based on timestamp
            name: scenarioName,
            industryCode,
            revenue,
            suppliers,
            procurement,
            carbonPrice,
            maturityCode,
            investment
        };
        
        // Add to saved scenarios
        savedScenarios.push(scenarioData);
        
        // Show the saved scenarios section
        document.getElementById('saved-scenarios').style.display = 'block';
        
        // Update the scenarios list
        updateSavedScenariosList();
        
        // Show confirmation
        alert(`Scenario "${scenarioName}" saved successfully.`);
    });
    
    // Set default carbon price
    document.getElementById('carbon-price').value = 50;
    
    // Add visual feedback for form fields
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        // Add animation effects on focus
        input.addEventListener('focus', function() {
            this.parentElement.style.transition = 'transform 0.2s ease';
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

/**
 * Function to update the saved scenarios list
 */
function updateSavedScenariosList() {
    const scenariosList = document.getElementById('scenarios-list');
    
    if (savedScenarios.length === 0) {
        scenariosList.innerHTML = '<p>No scenarios saved yet.</p>';
        return;
    }
    
    // Create HTML for saved scenarios
    let html = '';
    
    savedScenarios.forEach((scenario, index) => {
        html += `
            <div style="padding: 10px; margin-bottom: 10px; background-color: #f8f9fa; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${scenario.name}</strong>
                </div>
                <div>
                    <button 
                        type="button" 
                        class="load-scenario-btn" 
                        data-index="${index}" 
                        style="background-color: var(--secondary-color); padding: 5px 10px; margin-right: 5px;">
                        Load
                    </button>
                    <button 
                        type="button" 
                        class="delete-scenario-btn" 
                        data-index="${index}" 
                        style="background-color: #dc3545; padding: 5px 10px;">
                        Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    scenariosList.innerHTML = html;
    
    // Add event listeners to the buttons
    document.querySelectorAll('.load-scenario-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            loadScenario(savedScenarios[index]);
        });
    });
    
    document.querySelectorAll('.delete-scenario-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const confirmed = confirm(`Are you sure you want to delete the scenario "${savedScenarios[index].name}"?`);
            
            if (confirmed) {
                savedScenarios.splice(index, 1);
                updateSavedScenariosList();
                
                if (savedScenarios.length === 0) {
                    document.getElementById('saved-scenarios').style.display = 'none';
                }
            }
        });
    });
}

/**
 * Function to load a saved scenario
 * @param {object} scenario - The scenario data to load
 */
function loadScenario(scenario) {
    document.getElementById('industry').value = scenario.industryCode;
    document.getElementById('revenue').value = scenario.revenue;
    document.getElementById('suppliers').value = scenario.suppliers || '';
    document.getElementById('procurement').value = scenario.procurement || '';
    document.getElementById('carbon-price').value = scenario.carbonPrice;
    document.getElementById('maturity').value = scenario.maturityCode;
    document.getElementById('investment').value = scenario.investment || '';
    
    // Trigger revenue input event to update procurement placeholder
    const event = new Event('input');
    document.getElementById('revenue').dispatchEvent(event);
    
    // Scroll to top of form
    document.getElementById('roi-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Export procurement-specific ROI data to PDF
 * This function is called when exporting PDF from the procurement ROI tab
 * @param {object} results - The calculation results
 */
function exportProcurementROIPDF(results) {
    const { jsPDF } = window.jspdf;
    
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Calculate procurement-specific ROI data
    const procurementROI = calculateProcurementROI(results);
    
    // Format values in millions
    const formatMillions = (value) => {
        const inMillions = value / 1000000;
        return `$${inMillions.toFixed(2)}M`;
    };
    
    // Add header
    doc.setDrawColor(14, 124, 97);
    doc.setFillColor(14, 124, 97);
    doc.roundedRect(20, 10, 30, 5, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('SUSTAINABILITY', 35, 14, { align: 'center' });
    
    // Set title
    doc.setFontSize(20);
    doc.setTextColor(14, 124, 97);
    doc.text('Procurement-Specific ROI Report', pageWidth / 2, 25, { align: 'center' });
    
    // Add company details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Industry: ${results.industry.name}`, 20, 40);
    doc.text(`Annual Revenue: ${formatMillions(results.revenue)}`, 20, 47);
    doc.text(`Procurement Budget: ${formatMillions(procurementROI.procurementBudget)}`, 20, 54);
    doc.text(`Procurement Team Size: ${procurementROI.procurementTeamSize} staff`, 20, 61);
    
    // Add ROI summary
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 70, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('Procurement ROI Summary', pageWidth / 2, 78, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Procurement-Specific ROI: ${procurementROI.procurementROIRatio.toFixed(2)}x`, 30, 85);
    doc.text(`Budget Impact: ${procurementROI.budgetImpactPercent.toFixed(1)}% increase`, 30, 92);
    
    // Add benefits breakdown table
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('Budget Impact Breakdown (in millions)', pageWidth / 2, 110, { align: 'center' });
    
    // Table headers
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 115, pageWidth - 40, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Benefit Category', 25, 120);
    doc.text('Year 1', 85, 120);
    doc.text('Year 2', 115, 120);
    doc.text('Year 3', 145, 120);
    doc.text('Total', 175, 120);
    
    // Table rows
    doc.setFont(undefined, 'normal');
    let yPosition = 130;
    
    // Direct Cost Savings
    doc.text('Direct Cost Savings', 25, yPosition);
    doc.text(formatMillions(procurementROI.directSavings.year1), 85, yPosition);
    doc.text(formatMillions(procurementROI.directSavings.year2), 115, yPosition);
    doc.text(formatMillions(procurementROI.directSavings.year3), 145, yPosition);
    doc.text(formatMillions(procurementROI.directSavings.total), 175, yPosition);
    
    yPosition += 10;
    
    // Budget Allocation
    doc.text(`Budget Allocation (${(procurementROI.savingsAllocationPercent * 100).toFixed(0)}%)`, 25, yPosition);
    doc.text(formatMillions(procurementROI.budgetEnhancement.year1), 85, yPosition);
    doc.text(formatMillions(procurementROI.budgetEnhancement.year2), 115, yPosition);
    doc.text(formatMillions(procurementROI.budgetEnhancement.year3), 145, yPosition);
    doc.text(formatMillions(procurementROI.budgetEnhancement.total), 175, yPosition);
    
    yPosition += 10;
    
    // Productivity Savings
    doc.text('Productivity Improvements', 25, yPosition);
    doc.text(formatMillions(procurementROI.productivitySavings.year1), 85, yPosition);
    doc.text(formatMillions(procurementROI.productivitySavings.year2), 115, yPosition);
    doc.text(formatMillions(procurementROI.productivitySavings.year3), 145, yPosition);
    doc.text(formatMillions(procurementROI.productivitySavings.total), 175, yPosition);
    
    yPosition += 10;
    
    // Total Benefits
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    doc.setFont(undefined, 'bold');
    
    doc.text('Total Procurement Benefits', 25, yPosition);
    doc.text(formatMillions(procurementROI.totalProcurementBenefits.year1), 85, yPosition);
    doc.text(formatMillions(procurementROI.totalProcurementBenefits.year2), 115, yPosition);
    doc.text(formatMillions(procurementROI.totalProcurementBenefits.year3), 145, yPosition);
    doc.text(formatMillions(procurementROI.totalProcurementBenefits.total), 175, yPosition);
    
    yPosition += 10;
    
    // Investment Cost
    doc.setFont(undefined, 'normal');
    doc.text('Investment Cost', 25, yPosition);
    doc.text(formatMillions(procurementROI.investment.year1), 85, yPosition);
    doc.text(formatMillions(procurementROI.investment.year2), 115, yPosition);
    doc.text(formatMillions(procurementROI.investment.year3), 145, yPosition);
    doc.text(formatMillions(procurementROI.investment.total), 175, yPosition);
    
    // Add explanation and recommendations
    yPosition += 25;
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('Budget Impact Analysis', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    const explanation = `This analysis shows how the sustainability rating services investment impacts the procurement department's budget specifically. With a ${procurementROI.procurementROIRatio.toFixed(2)}x procurement-specific ROI, the initiative provides a significant return on investment for the procurement function alone.

The 3-year net budget enhancement represents ${procurementROI.budgetImpactPercent.toFixed(1)}% of the procurement department's budget over the same period. This additional budget can be reinvested into additional headcount, technology upgrades, staff training, or additional sustainability initiatives.

The analysis accounts for direct cost savings that can be allocated back to the procurement budget (${(procurementROI.savingsAllocationPercent * 100).toFixed(0)}% allocation assumed) and productivity improvements for the procurement team (estimated at 5 hours saved per month per staff member).`;
    
    const splitExplanation = doc.splitTextToSize(explanation, pageWidth - 40);
    doc.text(splitExplanation, 20, yPosition);
    
    // Add footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by the Sustainability Rating Services ROI Calculator', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Save the PDF
    doc.save('Procurement_ROI_Report.pdf');
}