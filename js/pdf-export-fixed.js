/**
 * PDF Export Functionality
 * Generates PDF reports of calculation results
 */

/**
 * Generate PDF report from calculation results
 * @param {object} companyData - Basic company information
 * @param {object} benefits - Calculated benefits
 * @param {object} investment - Investment costs
 */
function generatePDF(companyData, benefits, investment) {
    const { jsPDF } = window.jspdf;
    
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Format values in millions
    const formatMillions = (value) => {
        const inMillions = value / 1000000;
        return `$${inMillions.toFixed(2)}M`;
    };
    
    // Add company logo/branding (placeholder)
    doc.setDrawColor(14, 124, 97); // Primary color
    doc.setFillColor(14, 124, 97);
    doc.roundedRect(20, 10, 30, 5, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('SUSTAINABILITY', 35, 14, { align: 'center' });
    
    // Set title
    doc.setFontSize(20);
    doc.setTextColor(14, 124, 97); // Primary color
    doc.text('Sustainability Rating Services ROI Report', pageWidth / 2, 25, { align: 'center' });
    
    // Add company details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Industry: ${companyData.industry}`, 20, 40);
    doc.text(`Annual Revenue: ${companyData.revenue}`, 20, 47);
    doc.text(`Sustainability Maturity: ${companyData.maturity}`, 20, 54);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 61);
    
    // Add ROI metrics
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 70, pageWidth - 40, 25, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('ROI Summary', pageWidth / 2, 78, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`3-Year ROI Ratio: ${companyData.roiRatio}x`, 30, 85);
    doc.text(`Net Benefits: ${companyData.netBenefits}`, 30, 92);
    
    doc.text(`Payback Period: ${companyData.paybackMonths} months`, pageWidth - 30, 85, { align: 'right' });
    doc.text(`NPV (10% discount): ${companyData.npv}`, pageWidth - 30, 92, { align: 'right' });
    
    // Add benefits breakdown table
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('Benefits Breakdown (in millions)', pageWidth / 2, 110, { align: 'center' });
    
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
    
    // Procurement Savings
    doc.text('Procurement Cost Savings', 25, yPosition);
    doc.text(formatMillions(benefits.year1.procurementSavings), 85, yPosition);
    doc.text(formatMillions(benefits.year2.procurementSavings), 115, yPosition);
    doc.text(formatMillions(benefits.year3.procurementSavings), 145, yPosition);
    doc.text(formatMillions(
        benefits.year1.procurementSavings + 
        benefits.year2.procurementSavings + 
        benefits.year3.procurementSavings
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Carbon Value
    doc.text('Carbon Value Impact', 25, yPosition);
    doc.text(formatMillions(benefits.year1.carbonValueImpact), 85, yPosition);
    doc.text(formatMillions(benefits.year2.carbonValueImpact), 115, yPosition);
    doc.text(formatMillions(benefits.year3.carbonValueImpact), 145, yPosition);
    doc.text(formatMillions(
        benefits.year1.carbonValueImpact + 
        benefits.year2.carbonValueImpact + 
        benefits.year3.carbonValueImpact
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Risk Mitigation
    doc.text('Risk Mitigation Value', 25, yPosition);
    doc.text(formatMillions(benefits.year1.riskMitigationValue), 85, yPosition);
    doc.text(formatMillions(benefits.year2.riskMitigationValue), 115, yPosition);
    doc.text(formatMillions(benefits.year3.riskMitigationValue), 145, yPosition);
    doc.text(formatMillions(
        benefits.year1.riskMitigationValue + 
        benefits.year2.riskMitigationValue + 
        benefits.year3.riskMitigationValue
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Brand Value
    doc.text('Brand Value / Market Access', 25, yPosition);
    doc.text(formatMillions(benefits.year1.brandValueImpact), 85, yPosition);
    doc.text(formatMillions(benefits.year2.brandValueImpact), 115, yPosition);
    doc.text(formatMillions(benefits.year3.brandValueImpact), 145, yPosition);
    doc.text(formatMillions(
        benefits.year1.brandValueImpact + 
        benefits.year2.brandValueImpact + 
        benefits.year3.brandValueImpact
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Total Benefits
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    doc.setFont(undefined, 'bold');
    
    doc.text('Total Benefits', 25, yPosition);
    doc.text(formatMillions(benefits.year1.total), 85, yPosition);
    doc.text(formatMillions(benefits.year2.total), 115, yPosition);
    doc.text(formatMillions(benefits.year3.total), 145, yPosition);
    doc.text(formatMillions(
        benefits.year1.total + benefits.year2.total + benefits.year3.total
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Investment
    doc.setFont(undefined, 'normal');
    doc.text('Investment Cost', 25, yPosition);
    doc.text(formatMillions(investment.year1), 85, yPosition);
    doc.text(formatMillions(investment.year2), 115, yPosition);
    doc.text(formatMillions(investment.year3), 145, yPosition);
    doc.text(formatMillions(
        investment.year1 + investment.year2 + investment.year3
    ), 175, yPosition);
    
    yPosition += 10;
    
    // Net Benefits
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    doc.setFont(undefined, 'bold');
    
    doc.text('Net Benefits', 25, yPosition);
    doc.text(formatMillions(benefits.year1.total - investment.year1), 85, yPosition);
    doc.text(formatMillions(benefits.year2.total - investment.year2), 115, yPosition);
    doc.text(formatMillions(benefits.year3.total - investment.year3), 145, yPosition);
    doc.text(formatMillions(
        (benefits.year1.total + benefits.year2.total + benefits.year3.total) - 
        (investment.year1 + investment.year2 + investment.year3)
    ), 175, yPosition);
    
    // Add recommendations section
    yPosition += 20;
    doc.setFontSize(14);
    doc.setTextColor(14, 124, 97);
    doc.text('Recommendations', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    // Generate recommendation based on ROI
    let recommendation = '';
    if (parseFloat(companyData.roiRatio) >= 3) {
        recommendation = `With an ROI of ${companyData.roiRatio}x, your organization has a compelling business case for sustainability rating services. The financial benefits significantly outweigh the investment costs. Consider a comprehensive implementation approach.`;
    } else if (parseFloat(companyData.roiRatio) >= 2) {
        recommendation = `With an ROI of ${companyData.roiRatio}x, sustainability rating services would deliver solid value for your organization. Focus initial efforts on your highest-value opportunity areas and consider a phased implementation approach.`;
    } else if (parseFloat(companyData.roiRatio) >= 1) {
        recommendation = `With an ROI of ${companyData.roiRatio}x, sustainability rating services offer positive returns, but careful implementation planning is recommended. Start with targeted initiatives to build momentum.`;
    } else {
        recommendation = `With the current parameters, your ROI is below 1.0x. Consider focusing on specific high-value areas, adjusting your implementation timeline, or investigating industry-specific sustainability programs with lower initial costs.`;
    }
    
    // Add recommendation to PDF with text wrapping
    const splitRecommendation = doc.splitTextToSize(recommendation, pageWidth - 50);
    doc.text(splitRecommendation, 20, yPosition);
    
    // Add footer
    const footerY = pageHeight - 20;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by the Sustainability Rating Services ROI Calculator', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Save the PDF
    doc.save('Sustainability_ROI_Report.pdf');
}