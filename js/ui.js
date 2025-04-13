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
    
    // Generate HTML for results display
    const html = `
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
                        <span class="metric-value">${formatter.format(results.netBenefits)}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-name">Payback Period:</span>
                        <span class="metric-value">${results.paybackMonths} months</span>
                    </div>
                    <div class="metric">
                        <span class="metric-name">NPV (10% discount):</span>
                        <span class="metric-value">${formatter.format(results.npv)}</span>
                    </div>
                </div>
            </div>
            <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
                <p style="margin: 0;"><strong>Industry:</strong> ${results.industry.name} | <strong>Maturity Level:</strong> ${document.getElementById('maturity').value.charAt(0).toUpperCase() + document.getElementById('maturity').value.slice(1)}</p>
            </div>
        </div>
        
        <div class="benefits-table">
            <h3>Benefits Breakdown</h3>
            <p style="margin-bottom: 15px;">Summary of financial benefits by category over the 3-year period</p>
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
                        <td>${formatter.format(results.benefits.year1.procurementSavings)}</td>
                        <td>${formatter.format(results.benefits.year2.procurementSavings)}</td>
                        <td>${formatter.format(results.benefits.year3.procurementSavings)}</td>
                        <td>${formatter.format(
                            results.benefits.year1.procurementSavings + 
                            results.benefits.year2.procurementSavings + 
                            results.benefits.year3.procurementSavings
                        )}</td>
                    </tr>
                    <tr>
                        <td>Carbon Value Impact</td>
                        <td>${formatter.format(results.benefits.year1.carbonValueImpact)}</td>
                        <td>${formatter.format(results.benefits.year2.carbonValueImpact)}</td>
                        <td>${formatter.format(results.benefits.year3.carbonValueImpact)}</td>
                        <td>${formatter.format(
                            results.benefits.year1.carbonValueImpact + 
                            results.benefits.year2.carbonValueImpact + 
                            results.benefits.year3.carbonValueImpact
                        )}</td>
                    </tr>
                    <tr>
                        <td>Risk Mitigation Value</td>
                        <td>${formatter.format(results.benefits.year1.riskMitigationValue)}</td>
                        <td>${formatter.format(results.benefits.year2.riskMitigationValue)}</td>
                        <td>${formatter.format(results.benefits.year3.riskMitigationValue)}</td>
                        <td>${formatter.format(
                            results.benefits.year1.riskMitigationValue + 
                            results.benefits.year2.riskMitigationValue + 
                            results.benefits.year3.riskMitigationValue
                        )}</td>
                    </tr>
                    <tr>
                        <td>Brand Value / Market Access</td>
                        <td>${formatter.format(results.benefits.year1.brandValueImpact)}</td>
                        <td>${formatter.format(results.benefits.year2.brandValueImpact)}</td>
                        <td>${formatter.format(results.benefits.year3.brandValueImpact)}</td>
                        <td>${formatter.format(
                            results.benefits.year1.brandValueImpact + 
                            results.benefits.year2.brandValueImpact + 
                            results.benefits.year3.brandValueImpact
                        )}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Benefits</td>
                        <td>${formatter.format(results.benefits.year1.total)}</td>
                        <td>${formatter.format(results.benefits.year2.total)}</td>
                        <td>${formatter.format(results.benefits.year3.total)}</td>
                        <td>${formatter.format(
                            results.benefits.year1.total + 
                            results.benefits.year2.total + 
                            results.benefits.year3.total
                        )}</td>
                    </tr>
                    <tr>
                        <td>Investment Cost</td>
                        <td>${formatter.format(results.serviceInvestment.year1)}</td>
                        <td>${formatter.format(results.serviceInvestment.year2)}</td>
                        <td>${formatter.format(results.serviceInvestment.year3)}</td>
                        <td>${formatter.format(
                            results.serviceInvestment.year1 + 
                            results.serviceInvestment.year2 + 
                            results.serviceInvestment.year3
                        )}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Net Benefits</td>
                        <td>${formatter.format(results.benefits.year1.total - results.serviceInvestment.year1)}</td>
                        <td>${formatter.format(results.benefits.year2.total - results.serviceInvestment.year2)}</td>
                        <td>${formatter.format(results.benefits.year3.total - results.serviceInvestment.year3)}</td>
                        <td>${formatter.format(results.netBenefits)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div>
            <h3>Visualizations</h3>
            <div class="chart-tabs">
                <button id="benefits-tab" class="chart-tab active">Benefits Breakdown</button>
                <button id="cashflow-tab" class="chart-tab">Cumulative Cash Flow</button>
            </div>
            
            <div id="benefits-chart-container" class="chart-container">
                <canvas id="benefitsChart"></canvas>
            </div>
            
            <div id="cashflow-chart-container" class="chart-container" style="display: none;">
                <canvas id="cashFlowChart"></canvas>
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h3>Recommendations</h3>
            <p id="recommendations">${recommendations}</p>
        </div>
        
        <div style="margin-top: 20px; text-align: right;">
            <button id="export-btn" style="background-color: #6c757d;">
                <span style="display: inline-block; margin-right: 5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </svg>
                </span>
                Export Results as PDF
            </button>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
    
    // Add event listeners for the chart tabs and export button
    document.getElementById('benefits-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('cashflow-tab').classList.remove('active');
        document.getElementById('benefits-chart-container').style.display = 'block';
        document.getElementById('cashflow-chart-container').style.display = 'none';
    });
    
    document.getElementById('cashflow-tab').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('benefits-tab').classList.remove('active');
        document.getElementById('benefits-chart-container').style.display = 'none';
        document.getElementById('cashflow-chart-container').style.display = 'block';
    });
    
    // Set up PDF export functionality
    document.getElementById('export-btn').addEventListener('click', function() {
        // Prepare data for PDF export
        const companyData = {
            industry: results.industry.name,
            revenue: formatter.format(document.getElementById('revenue').value),
            maturity: document.getElementById('maturity').value.charAt(0).toUpperCase() + document.getElementById('maturity').value.slice(1),
            roiRatio: results.roiRatio.toFixed(2),
            netBenefits: formatter.format(results.netBenefits),
            paybackMonths: results.paybackMonths,
            npv: formatter.format(results.npv)
        };
        
        // Generate PDF
        generatePDF(companyData, results.benefits, results.serviceInvestment);
    });
    
    // Create charts
    createCharts({
        benefits: results.benefits,
        serviceInvestment: results.serviceInvestment
    });
}

/**
 * Create charts for visualizing the results
 * @param {object} data - The data for the charts
 */
function createCharts(data) {
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
                        data.benefits.year1.procurementSavings,
                        data.benefits.year2.procurementSavings,
                        data.benefits.year3.procurementSavings
                    ],
                    backgroundColor: '#4eb38f',
                },
                {
                    label: 'Carbon Value Impact',
                    data: [
                        data.benefits.year1.carbonValueImpact,
                        data.benefits.year2.carbonValueImpact,
                        data.benefits.year3.carbonValueImpact
                    ],
                    backgroundColor: '#0e7c61',
                },
                {
                    label: 'Risk Mitigation Value',
                    data: [
                        data.benefits.year1.riskMitigationValue,
                        data.benefits.year2.riskMitigationValue,
                        data.benefits.year3.riskMitigationValue
                    ],
                    backgroundColor: '#ffc107',
                },
                {
                    label: 'Brand Value / Market Access',
                    data: [
                        data.benefits.year1.brandValueImpact,
                        data.benefits.year2.brandValueImpact,
                        data.benefits.year3.brandValueImpact
                    ],
                    backgroundColor: '#6c757d',
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Benefits Breakdown by Category and Year',
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
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
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
                            return '$' + value.toLocaleString();
                        },
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: 'USD'
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
    
    new Chart(cashFlowCtx, {
        type: 'line',
        data: {
            labels: ['Initial', 'Year 1', 'Year 2', 'Year 3'],
            datasets: [{
                label: 'Cumulative Cash Flow',
                data: cumulativeCashFlow,
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
                    text: 'Cumulative Cash Flow',
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
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
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
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'USD'
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
        
        // Use setTimeout to allow the loading spinner to render before calculations begin
        setTimeout(() => {
            calculateROI();
            // Hide loading spinner
            document.getElementById('loading').style.display = 'none';
        }, 800); // Simulate calculation time
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
            document.getElementById('procurement').placeholder = `Calculated: ${Math.round(procurementSpend).toLocaleString()} USD`;
        }
    });
    
    // Update procurement placeholder when industry changes
    document.getElementById('industry').addEventListener('change', function() {
        const revenue = parseFloat(document.getElementById('revenue').value);
        const industryCode = this.value;
        
        if (industryCode && revenue) {
            const industry = industryParameters[industryCode];
            const procurementSpend = revenue * industry.procurementPercent;
            document.getElementById('procurement').placeholder = `Calculated: ${Math.round(procurementSpend).toLocaleString()} USD`;
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
        const scenarioName = `${industry.name} - ${new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        }).format(revenue)} Revenue`;
        
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
