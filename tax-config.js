/**
 * IRS Tax Figures Configuration
 * 
 * UPDATE THIS FILE ANNUALLY when the IRS publishes new figures
 * (typically in October/November for the following year)
 * 
 * IRS Source: https://www.irs.gov/newsroom
 * 
 * Last Updated: January 2026
 */

const TAX_FIGURES = {
    // Annual Gift Tax Exclusion (per recipient)
    // IRS Rev. Proc. announces this each fall
    annualGiftExclusion: {
        2024: 18000,
        2025: 18000,
        2026: 19000,
        2027: 19000  // Update when IRS announces (typically Oct/Nov 2026)
    },
    
    // Federal Estate/Gift Tax Exemption (per person, lifetime)
    estateExemption: {
        2024: 13610000,
        2025: 13990000,
        2026: 13990000,  // Note: TCJA sunset may reduce this - update as laws change
        2027: 13990000   // Update when IRS announces
    },
    
    // GST (Generation-Skipping Transfer) Tax Exemption
    gstExemption: {
        2024: 13610000,
        2025: 13990000,
        2026: 13990000,
        2027: 13990000
    },
    
    // Estate Exemption for Married Couples (with portability)
    // This is simply 2x the individual exemption
    estateExemptionMarried: {
        2024: 27220000,
        2025: 27980000,
        2026: 27980000,
        2027: 27980000
    }
};

/**
 * Get the current year's tax figure
 * Falls back to the most recent year if current year not found
 */
function getTaxFigure(figureType) {
    const currentYear = new Date().getFullYear();
    const figures = TAX_FIGURES[figureType];
    
    if (!figures) {
        console.warn(`Tax figure type "${figureType}" not found`);
        return null;
    }
    
    // Try current year, then fall back to most recent available
    if (figures[currentYear]) {
        return { year: currentYear, amount: figures[currentYear] };
    }
    
    // Find the most recent year available
    const years = Object.keys(figures).map(Number).sort((a, b) => b - a);
    for (const year of years) {
        if (year <= currentYear) {
            return { year: year, amount: figures[year] };
        }
    }
    
    // If no past year found, use the earliest available
    const earliestYear = years[years.length - 1];
    return { year: earliestYear, amount: figures[earliestYear] };
}

/**
 * Format a number as currency (e.g., $19,000)
 */
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US');
}

/**
 * Format large amounts in millions (e.g., $13.61 million)
 */
function formatMillions(amount) {
    const millions = amount / 1000000;
    return '$' + millions.toFixed(2) + ' million';
}

/**
 * Update all tax figure placeholders on the page
 * Call this on DOMContentLoaded
 */
function updateTaxFigures() {
    // Annual Gift Exclusion
    const giftExclusion = getTaxFigure('annualGiftExclusion');
    document.querySelectorAll('.tax-annual-gift').forEach(el => {
        el.textContent = formatCurrency(giftExclusion.amount);
    });
    document.querySelectorAll('.tax-annual-gift-year').forEach(el => {
        el.textContent = giftExclusion.year;
    });
    
    // Estate Exemption (Individual)
    const estateExemption = getTaxFigure('estateExemption');
    document.querySelectorAll('.tax-estate-exemption').forEach(el => {
        el.textContent = formatMillions(estateExemption.amount);
    });
    document.querySelectorAll('.tax-estate-exemption-year').forEach(el => {
        el.textContent = estateExemption.year;
    });
    
    // Estate Exemption (Married Couples)
    const estateExemptionMarried = getTaxFigure('estateExemptionMarried');
    document.querySelectorAll('.tax-estate-exemption-married').forEach(el => {
        el.textContent = formatMillions(estateExemptionMarried.amount);
    });
    
    // Current year
    document.querySelectorAll('.tax-current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTaxFigures);
} else {
    updateTaxFigures();
}

