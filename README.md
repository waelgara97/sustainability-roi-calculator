# Sustainability Rating Services ROI Calculator

An interactive web-based calculator that helps organizations evaluate the financial benefits and return on investment (ROI) of implementing sustainability rating services across their supply chain.

## 🌐 Live Demo

**Try it now:** [https://waelgara97.github.io/sustainability-roi-calculator/](https://waelgara97.github.io/sustainability-roi-calculator/)

[![ROI Calculator Screenshot](https://user-images.githubusercontent.com/191771839/294232234-70f876c8-a123-4e3c-8db3-e4ddbd72c75e.png)](https://waelgara97.github.io/sustainability-roi-calculator/)

## Overview

This calculator uses industry-specific data to estimate the financial impact of sustainability initiatives across four key benefit categories:

1. **Procurement Cost Savings** - Identify inefficiencies and reduce waste in your supply chain
2. **Carbon Value Impact** - Quantify the financial value of reduced carbon emissions
3. **Risk Mitigation Value** - Reduce exposure to supply chain disruptions and regulatory penalties
4. **Brand Value / Market Access** - Enhance reputation and access to new markets

## Features

- Industry-specific parameters based on EPA USEEIO Supply Chain GHG Emission Factors (v1.3.0)
- Comprehensive coverage of 23 NAICS industry sectors
- Interactive charts and visualizations
- Financial metrics including ROI ratio, payback period, and NPV
- PDF export functionality for reporting
- Scenario comparison capability
- Mobile-responsive design

## Data Sources

The calculator uses data from:

- U.S. Census Bureau Annual Survey of Manufactures (2021)
- EPA USEEIO Supply Chain GHG Emission Factors (v1.3.0)
- McKinsey "Buying into a more sustainable value chain" (2021)
- EcoVadis Sustainable Procurement Barometer (2023)
- World Economic Forum Net-Zero Industry Tracker (2024)

## Key Assumptions

- Procurement as % of revenue based on industry benchmarks (ranges from 25-70%)
- Emission factors derived from EPA USEEIO model (kg CO2e/USD)
- Cost savings opportunities range from 0.8-1.5% of procurement spend based on industry
- Carbon reduction potential: 15% year 1, 19.5% year 2, 25.4% year 3
- Risk reduction values based on industry risk profile and emission intensity
- Brand value impact increases from 0.1% of revenue in year 1 to 0.2% in year 3

## How to Use

1. Select your industry sector from the dropdown menu
2. Enter your company's annual revenue
3. Optionally provide supplier count, procurement spend, and custom investment amount
4. Select your organization's sustainability maturity level
5. Click "Calculate ROI" to see your results

The calculator will generate:
- ROI ratio and financial summary
- Detailed breakdown of benefits by category
- Visual charts of benefits and cumulative cash flow
- Tailored recommendations based on your results

## Technology Stack

- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for data visualization
- jsPDF for PDF export functionality
- No server-side dependencies - runs entirely in the browser

## Installation

No installation required! This is a client-side web application that can be served from any static web server.

1. Clone this repository: `git clone https://github.com/waelgara97/sustainability-roi-calculator.git`
2. Open `index.html` in your web browser

Alternatively, you can deploy to any web hosting service that supports static websites.

## Deployment

This project is automatically deployed to GitHub Pages at:
**[https://waelgara97.github.io/sustainability-roi-calculator/](https://waelgara97.github.io/sustainability-roi-calculator/)**

When changes are pushed to the main branch, a GitHub Actions workflow will deploy the updated calculator to the GitHub Pages site.

To set up deployment for your own fork:
1. Go to the repository settings
2. Navigate to the "Pages" section in the sidebar
3. Under "Build and deployment", select "Source: GitHub Actions"

## License

MIT License

## Contact

For questions or suggestions about this calculator, please create an issue in this repository.
