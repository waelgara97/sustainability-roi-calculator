/**
 * Procurement-Specific ROI Calculator
 * Focuses on direct budget impact for procurement teams
 */

/**
 * Calculate the procurement team-specific ROI and budget impact
 * @param {object} results - Main calculation results
 * @returns {object} - Procurement-specific ROI metrics
 */
function calculateProcurementROI(results) {
    // Get procurement-specific parameters or use defaults if elements don't exist yet
    let procurementTeamSize;
    let procurementBudgetPercent = 0.015; // Default: 1.5% of procurement spend
    let savingsAllocationPercent = 0.15; // Default: 15% of savings allocated to procurement
    let annualHourRate = 75; // Default hourly rate
    
    // Safely get values from form elements if they exist
    const teamSizeElement = document.getElementById('procurement-team-size');
    if (teamSizeElement && teamSizeElement.value) {
        procurementTeamSize = parseInt(teamSizeElement.value);
    } else {
        procurementTeamSize = estimateProcurementTeamSize(results.revenue);
    }
    
    const budgetPercentElement = document.getElementById('procurement-budget-percent');
    if (budgetPercentElement && budgetPercentElement.value) {
        procurementBudgetPercent = parseFloat(budgetPercentElement.value) / 100;
    }
    
    const savingsAllocationElement = document.getElementById('savings-allocation');
    if (savingsAllocationElement && savingsAllocationElement.value) {
        savingsAllocationPercent = parseFloat(savingsAllocationElement.value) / 100;
    }
    
    const staffHourRateElement = document.getElementById('staff-hour-rate');
    if (staffHourRateElement && staffHourRateElement.value) {
        annualHourRate = parseFloat(staffHourRateElement.value);
    }
    
    // Calculate procurement department's annual budget
    const procurementBudget = results.procurementSpend * procurementBudgetPercent;
    
    // Calculate direct cost savings for procurement team
    // We focus only on the procurement cost savings, as this directly impacts procurement budget
    const directSavings = {
        year1: results.benefits.year1.procurementSavings,
        year2: results.benefits.year2.procurementSavings,
        year3: results.benefits.year3.procurementSavings,
        total: results.benefits.year1.procurementSavings + 
               results.benefits.year2.procurementSavings +
               results.benefits.year3.procurementSavings
    };
    
    // Calculate budget enhancement for procurement department
    const budgetEnhancement = {
        year1: directSavings.year1 * savingsAllocationPercent,
        year2: directSavings.year2 * savingsAllocationPercent,
        year3: directSavings.year3 * savingsAllocationPercent,
        total: directSavings.total * savingsAllocationPercent
    };
    
    // Calculate productivity improvements
    // Estimate how many hours saved per month per procurement staff
    const hoursSavedPerStaff = 5; // Default: 5 hours per month per staff
    
    const productivitySavings = {
        year1: procurementTeamSize * hoursSavedPerStaff * 12 * annualHourRate,
        year2: procurementTeamSize * hoursSavedPerStaff * 12 * annualHourRate * 1.2, // 20% more in year 2
        year3: procurementTeamSize * hoursSavedPerStaff * 12 * annualHourRate * 1.3, // 30% more in year 3
    };
    productivitySavings.total = productivitySavings.year1 + productivitySavings.year2 + productivitySavings.year3;
    
    // Calculate procurement-specific ROI
    // Investment is still the same
    const investment = {
        year1: results.serviceInvestment.year1,
        year2: results.serviceInvestment.year2,
        year3: results.serviceInvestment.year3,
        total: results.serviceInvestment.year1 + 
               results.serviceInvestment.year2 + 
               results.serviceInvestment.year3
    };
    
    // Calculate total procurement-specific benefits
    const totalProcurementBenefits = {
        year1: budgetEnhancement.year1 + productivitySavings.year1,
        year2: budgetEnhancement.year2 + productivitySavings.year2,
        year3: budgetEnhancement.year3 + productivitySavings.year3,
        total: budgetEnhancement.total + productivitySavings.total
    };
    
    // Calculate procurement ROI ratio
    const procurementROIRatio = totalProcurementBenefits.total / investment.total;
    
    // Calculate budget impact as percentage
    const budgetImpactPercent = (budgetEnhancement.total / (procurementBudget * 3)) * 100;
    
    // Return all calculated metrics
    return {
        procurementTeamSize,
        procurementBudget,
        procurementBudgetPercent,
        directSavings,
        savingsAllocationPercent,
        budgetEnhancement,
        productivitySavings,
        totalProcurementBenefits,
        investment,
        procurementROIRatio,
        budgetImpactPercent
    };
}

/**
 * Estimate procurement team size based on company revenue
 * @param {number} revenue - Company annual revenue
 * @returns {number} - Estimated procurement team size
 */
function estimateProcurementTeamSize(revenue) {
    // Basic estimation logic: 
    // Smaller companies: 1 procurement professional per $50-100M revenue
    // Medium companies: 1 per $100-250M revenue
    // Large companies: 1 per $250-500M revenue
    // Very large companies: diminishing returns, 1 per $500M+ revenue
    
    const revenueInMillions = revenue / 1000000;
    
    if (revenueInMillions <= 100) {
        return Math.max(1, Math.ceil(revenueInMillions / 50));
    } else if (revenueInMillions <= 500) {
        return Math.ceil(2 + (revenueInMillions - 100) / 100);
    } else if (revenueInMillions <= 5000) {
        return Math.ceil(6 + (revenueInMillions - 500) / 250);
    } else {
        return Math.ceil(24 + (revenueInMillions - 5000) / 500);
    }
}

/**
 * Display procurement-specific ROI results
 * @param {object} results - Main calculation results
 */
function displayProcurementROI(results) {
    try {
        // Calculate procurement-specific ROI
        const procurementROI = calculateProcurementROI(results);
        
        // Format values for display
        const formatMillions = (value) => {
            const inMillions = value / 1000000;
            return `$${inMillions.toFixed(2)}M`;
        };
        
        // Generate ROI color based on value
        const getROIColor = (roi) => {
            if (roi >= 2) return "#0e7c61"; // Excellent
            if (roi >= 1) return "#4eb38f"; // Good
            if (roi >= 0.5) return "#ffc107"; // Fair
            return "#dc3545"; // Poor
        };
        
        const roiColor = getROIColor(procurementROI.procurementROIRatio);
        
        // Generate HTML for procurement ROI display
        const html = `
            <div class="procurement-roi-results">
                <h3>Procurement Department Budget Impact</h3>
                
                <div class="procurement-summary">
                    <div class="metric-box" style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-size: 16px; font-weight: bold;">Procurement-Specific ROI:</span>
                                <div style="font-size: 32px; font-weight: bold; color: ${roiColor};">${procurementROI.procurementROIRatio.toFixed(2)}x</div>
                                <span style="font-size: 14px; color: #666;">Based on direct budget benefits</span>
                            </div>
                            <div style="text-align: right;">
                                <div class="metric">
                                    <span class="metric-name">Procurement Team Size:</span>
                                    <span class="metric-value">${procurementROI.procurementTeamSize} staff</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-name">Annual Procurement Budget:</span>
                                    <span class="metric-value">${formatMillions(procurementROI.procurementBudget)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-name">3-Year Budget Enhancement:</span>
                                    <span class="metric-value">${formatMillions(procurementROI.budgetEnhancement.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="budget-impact-table">
                    <h4>Budget Impact Breakdown (in millions)</h4>
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
                                <td>Direct Cost Savings</td>
                                <td>${formatMillions(procurementROI.directSavings.year1)}</td>
                                <td>${formatMillions(procurementROI.directSavings.year2)}</td>
                                <td>${formatMillions(procurementROI.directSavings.year3)}</td>
                                <td>${formatMillions(procurementROI.directSavings.total)}</td>
                            </tr>
                            <tr>
                                <td>Budget Allocation (${(procurementROI.savingsAllocationPercent * 100).toFixed(0)}% of savings)</td>
                                <td>${formatMillions(procurementROI.budgetEnhancement.year1)}</td>
                                <td>${formatMillions(procurementROI.budgetEnhancement.year2)}</td>
                                <td>${formatMillions(procurementROI.budgetEnhancement.year3)}</td>
                                <td>${formatMillions(procurementROI.budgetEnhancement.total)}</td>
                            </tr>
                            <tr>
                                <td>Productivity Improvements</td>
                                <td>${formatMillions(procurementROI.productivitySavings.year1)}</td>
                                <td>${formatMillions(procurementROI.productivitySavings.year2)}</td>
                                <td>${formatMillions(procurementROI.productivitySavings.year3)}</td>
                                <td>${formatMillions(procurementROI.productivitySavings.total)}</td>
                            </tr>
                            <tr class="total-row">
                                <td>Total Procurement Benefits</td>
                                <td>${formatMillions(procurementROI.totalProcurementBenefits.year1)}</td>
                                <td>${formatMillions(procurementROI.totalProcurementBenefits.year2)}</td>
                                <td>${formatMillions(procurementROI.totalProcurementBenefits.year3)}</td>
                                <td>${formatMillions(procurementROI.totalProcurementBenefits.total)}</td>
                            </tr>
                            <tr>
                                <td>Investment</td>
                                <td>${formatMillions(procurementROI.investment.year1)}</td>
                                <td>${formatMillions(procurementROI.investment.year2)}</td>
                                <td>${formatMillions(procurementROI.investment.year3)}</td>
                                <td>${formatMillions(procurementROI.investment.total)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="budget-impact-visual" style="margin-top: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <h4>Budget Impact</h4>
                    <div style="display: flex; align-items: center; margin-top: 10px;">
                        <div style="width: 60%; padding-right: 20px;">
                            <p>The 3-year net budget enhancement represents <strong>${procurementROI.budgetImpactPercent.toFixed(1)}%</strong> of the procurement department's budget over the same period.</p>
                            <p>This additional budget can be reinvested into:</p>
                            <ul>
                                <li>Additional headcount or retention bonuses</li>
                                <li>Technology and tool upgrades</li>
                                <li>Staff training and development</li>
                                <li>Additional sustainability initiatives</li>
                            </ul>
                        </div>
                        <div style="width: 40%;">
                            <canvas id="budgetImpactChart" width="200" height="200"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="procurement-parameters" style="margin-top: 20px;">
                    <h4>Customize Procurement Parameters</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;">
                        <div style="flex: 1; min-width: 200px;">
                            <label for="procurement-team-size">Procurement Team Size:</label>
                            <input type="number" id="procurement-team-size" placeholder="Auto-estimate based on revenue" min="1" style="width: 100%; padding: 8px; margin-top: 5px;">
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label for="procurement-budget-percent">Procurement Budget (% of spend):</label>
                            <input type="number" id="procurement-budget-percent" placeholder="1.5" min="0.1" max="10" step="0.1" style="width: 100%; padding: 8px; margin-top: 5px;">
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label for="savings-allocation">Savings to Budget Allocation (%):</label>
                            <input type="number" id="savings-allocation" placeholder="15" min="0" max="100" style="width: 100%; padding: 8px; margin-top: 5px;">
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label for="staff-hour-rate">Staff Hourly Rate ($):</label>
                            <input type="number" id="staff-hour-rate" placeholder="75" min="20" style="width: 100%; padding: 8px; margin-top: 5px;">
                        </div>
                    </div>
                    <button id="recalculate-procurement" style="margin-top: 15px; padding: 8px 15px; background-color: #4eb38f; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Recalculate Procurement ROI
                    </button>
                </div>
                
                <div style="margin-top: 20px; text-align: right;">
                    <button id="export-procurement-btn" class="export-btn" style="background-color: #6c757d;">
                        <span style="display: inline-block; margin-right: 5px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            </svg>
                        </span>
                        Export Procurement ROI as PDF
                    </button>
                </div>
            </div>
        `;
        
        // Add the HTML to the procurement ROI tab content
        const procurementContainer = document.getElementById('procurement-roi-container');
        if (procurementContainer) {
            procurementContainer.innerHTML = html;
            
            // Create the budget impact chart
            setTimeout(() => {
                try {
                    createBudgetImpactChart(procurementROI);
                    
                    // Add event listener for the recalculate button
                    const recalculateBtn = document.getElementById('recalculate-procurement');
                    if (recalculateBtn) {
                        recalculateBtn.addEventListener('click', function() {
                            displayProcurementROI(results);
                        });
                    }
                    
                    // Add event listener for the export button
                    const exportBtn = document.getElementById('export-procurement-btn');
                    if (exportBtn) {
                        exportBtn.addEventListener('click', function() {
                            exportProcurementROIPDF(results);
                        });
                    }
                } catch (chartError) {
                    console.error("Error creating chart:", chartError);
                    // Display a simple error message in the chart container
                    const chartContainer = document.getElementById('budgetImpactChart');
                    if (chartContainer) {
                        chartContainer.parentNode.innerHTML = `
                            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24;">
                                <p>Unable to load chart. Please try refreshing the page.</p>
                            </div>
                        `;
                    }
                }
            }, 100); // Small delay to ensure DOM is ready
            
        } else {
            console.error("Procurement ROI container not found");
        }
        
    } catch (error) {
        console.error("Error displaying procurement ROI:", error);
        // Display error message
        const container = document.getElementById('procurement-roi-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px; background-color: #f8d7da; border-radius: 4px; color: #721c24;">
                    <h3>Error Loading Procurement ROI</h3>
                    <p>Sorry, there was an error calculating the procurement-specific ROI. Please try refreshing the page.</p>
                    <p><a href="#" id="retry-procurement-roi" style="color: #0e7c61; font-weight: bold;">Try Again</a></p>
                </div>
            `;
            
            // Add retry button functionality
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-procurement-roi');
                if (retryBtn) {
                    retryBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        displayProcurementROI(results);
                    });
                }
            }, 100);
        }
    }
}

/**
 * Create a pie chart showing budget impact
 * @param {object} procurementROI - Procurement ROI results
 */
function createBudgetImpactChart(procurementROI) {
    // Check if the canvas element exists
    const canvas = document.getElementById('budgetImpactChart');
    if (!canvas) {
        console.error("Budget impact chart canvas not found");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Calculate 3-year baseline budget
    const threeYearBudget = procurementROI.procurementBudget * 3;
    
    // Budget enhancement as percentage
    const enhancementPercent = (procurementROI.budgetEnhancement.total / threeYearBudget) * 100;
    
    // Create data for pie chart
    const data = {
        labels: ['Base Budget', 'Enhancement'],
        datasets: [{
            data: [100 - enhancementPercent, enhancementPercent],
            backgroundColor: ['#6c757d', '#4eb38f'],
            hoverBackgroundColor: ['#5a6268', '#0e7c61']
        }]
    };
    
    // Create the chart
    try {
        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error creating budget impact chart:", error);
    }
}