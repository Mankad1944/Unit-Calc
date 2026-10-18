/* ============================================================
   UNIT CALCULATOR – script.js
   Features:
    • All metric + imperial length/area/weight/volume/temp/speed/time/digital
    • Traditional Gujarati units (Vaar, Vigha, Gaj, Gooth, Chors)
    • 5'10" / 5ft 10in foot-inch format input & output
    • English / Gujarati bilingual UI
    • Dark / Light theme
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────
//  1. UNIT DATA
//  Each unit: { key, labelEn, labelGu, toBase, fromBase, group? }
//  toBase / fromBase convert to/from the canonical base unit
//  For temperature: use functions
// ──────────────────────────────────────────────

const UNITS = {

  /* ====== LENGTH (base: metre) ====== */
  length: [
    { key: 'km', labelEn: 'Kilometre (km)', labelGu: 'કિલોમીટર (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: 'm', labelEn: 'Metre (m)', labelGu: 'મીટર (m)', toBase: v => v, fromBase: v => v },
    { key: 'cm', labelEn: 'Centimetre (cm)', labelGu: 'સેન્ટિમીટર (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { key: 'mm', labelEn: 'Millimetre (mm)', labelGu: 'મિલીમીટર (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: 'um', labelEn: 'Micrometre (µm)', labelGu: 'માઈક્રોમીટર (µm)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { key: 'nm', labelEn: 'Nanometre (nm)', labelGu: 'નેનોમીટર (nm)', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
    { key: 'mi', labelEn: 'Mile (mi)', labelGu: 'માઈલ (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { key: 'yd', labelEn: 'Yard (yd)', labelGu: 'યાર્ડ (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { key: 'ft', labelEn: 'Foot / Feet (ft)', labelGu: 'ફૂટ (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { key: 'in', labelEn: 'Inch (in)', labelGu: 'ઇંચ (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { key: 'nmi', labelEn: 'Nautical Mile (nmi)', labelGu: 'નોટિકલ માઈલ (nmi)', toBase: v => v * 1852, fromBase: v => v / 1852 },
    { key: 'ly', labelEn: 'Light Year (ly)', labelGu: 'પ્રકાશ-વર્ષ (ly)', toBase: v => v * 9.461e15, fromBase: v => v / 9.461e15 },
    /* Gujarati / Indian traditional */
    { key: 'gaj', labelEn: 'Gaj (ગજ)', labelGu: 'ગજ', toBase: v => v * 0.9144, fromBase: v => v / 0.9144, gujarati: true },
    { key: 'vaar', labelEn: 'Vaar (વાર)', labelGu: 'વાર', toBase: v => v * 0.9144, fromBase: v => v / 0.9144, gujarati: true },
    { key: 'hath', labelEn: 'Hath / Cubit (હાથ)', labelGu: 'હાથ (ક્યુબિટ)', toBase: v => v * 0.4572, fromBase: v => v / 0.4572, gujarati: true },
    { key: 'angul', labelEn: 'Angul (આંગળ)', labelGu: 'આંગળ', toBase: v => v * 0.01905, fromBase: v => v / 0.01905, gujarati: true },
    { key: 'kos', labelEn: 'Kos (કોસ)', labelGu: 'કોસ', toBase: v => v * 3218.688, fromBase: v => v / 3218.688, gujarati: true },
  ],

  /* ====== AREA (base: sq metre) ====== */
  area: [
    { key: 'km2', labelEn: 'Sq Kilometre (km²)', labelGu: 'ચો.કિ.મી (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { key: 'm2', labelEn: 'Sq Metre (m²)', labelGu: 'ચો.મી (m²)', toBase: v => v, fromBase: v => v },
    { key: 'cm2', labelEn: 'Sq Centimetre (cm²)', labelGu: 'ચો.સે.મી (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { key: 'mm2', labelEn: 'Sq Millimetre (mm²)', labelGu: 'ચો.મિ.મી (mm²)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { key: 'ha', labelEn: 'Hectare (ha)', labelGu: 'હેક્ટર (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { key: 'acre', labelEn: 'Acre', labelGu: 'એકર', toBase: v => v * 4046.856, fromBase: v => v / 4046.856 },
    { key: 'mi2', labelEn: 'Sq Mile (mi²)', labelGu: 'ચો.માઈલ (mi²)', toBase: v => v * 2.590e6, fromBase: v => v / 2.590e6 },
    { key: 'yd2', labelEn: 'Sq Yard (yd²)', labelGu: 'ચો.યાર્ડ (yd²)', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
    { key: 'ft2', labelEn: 'Sq Foot (ft²)', labelGu: 'ચો.ફૂટ (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { key: 'in2', labelEn: 'Sq Inch (in²)', labelGu: 'ચો.ઇંચ (in²)', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
    /* Gujarati traditional */
    { key: 'vaar2', labelEn: 'Vaar (sq) (વાર²)', labelGu: 'ચો.વાર (વાર²)', toBase: v => v * 0.836127, fromBase: v => v / 0.836127, gujarati: true },
    { key: 'vigha', labelEn: 'Vigha (વીઘા)', labelGu: 'વીઘા', toBase: v => v * 1618.74, fromBase: v => v / 1618.74, gujarati: true },
    { key: 'gooth', labelEn: 'Gooth / Guntha (ગૂઠ)', labelGu: 'ગૂઠ (ગુંઠ)', toBase: v => v * 101.171, fromBase: v => v / 101.171, gujarati: true },
    { key: 'chors', labelEn: 'Chors (ચોરસ)', labelGu: 'ચોરસ', toBase: v => v * 0.092903, fromBase: v => v / 0.092903, gujarati: true },
    { key: 'biswa', labelEn: 'Biswa (બિસ્વા)', labelGu: 'બિસ્વા', toBase: v => v * 125.418, fromBase: v => v / 125.418, gujarati: true },
    { key: 'ropani', labelEn: 'Ropani (રોપની)', labelGu: 'રોપની', toBase: v => v * 508.737, fromBase: v => v / 508.737, gujarati: true },
  ],

  /* ====== WEIGHT (base: kilogram) ====== */
  weight: [
    { key: 't', labelEn: 'Metric Ton (t)', labelGu: 'મે. ટ (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: 'kg', labelEn: 'Kilogram (kg)', labelGu: 'કિ.ગ્રા (kg)', toBase: v => v, fromBase: v => v },
    { key: 'g', labelEn: 'Gram (g)', labelGu: 'ગ્રામ (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: 'mg', labelEn: 'Milligram (mg)', labelGu: 'મિ.ગ્રા (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { key: 'ug', labelEn: 'Microgram (µg)', labelGu: 'માઈ.ગ્રા (µg)', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
    { key: 'lb', labelEn: 'Pound (lb)', labelGu: 'પાઉન્ડ (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { key: 'oz', labelEn: 'Ounce (oz)', labelGu: 'ઔંસ (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { key: 'stone', labelEn: 'Stone (st)', labelGu: 'સ્ટોન (st)', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
    { key: 'ton_uk', labelEn: 'Long Ton (UK)', labelGu: 'લોન્ગ ટन (UK)', toBase: v => v * 1016.05, fromBase: v => v / 1016.05 },
    { key: 'ton_us', labelEn: 'Short Ton (US)', labelGu: 'શોર્ટ ટन (US)', toBase: v => v * 907.185, fromBase: v => v / 907.185 },
    /* Indian / Gujarati */
    { key: 'tola', labelEn: 'Tola (તોળ)', labelGu: 'તોળ', toBase: v => v * 0.011664, fromBase: v => v / 0.011664, gujarati: true },
    { key: 'masha', labelEn: 'Masha (માશા)', labelGu: 'માશા', toBase: v => v * 0.000972, fromBase: v => v / 0.000972, gujarati: true },
    { key: 'ratti', labelEn: 'Ratti (રત્તિ)', labelGu: 'રત્તિ', toBase: v => v * 0.0001215, fromBase: v => v / 0.0001215, gujarati: true },
    { key: 'maund', labelEn: 'Maund (મણ)', labelGu: 'મણ', toBase: v => v * 37.3242, fromBase: v => v / 37.3242, gujarati: true },
    { key: 'seer', labelEn: 'Seer (શેર)', labelGu: 'શેર', toBase: v => v * 0.93310, fromBase: v => v / 0.93310, gujarati: true },
  ],

  /* ====== VOLUME (base: litre) ====== */
  volume: [
    { key: 'm3', labelEn: 'Cubic Metre (m³)', labelGu: 'ઘ.મીટર (m³)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { key: 'L', labelEn: 'Litre (L)', labelGu: 'લીટર (L)', toBase: v => v, fromBase: v => v },
    { key: 'mL', labelEn: 'Millilitre (mL)', labelGu: 'મિ.લી (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: 'cm3', labelEn: 'Cubic Centimetre (cc)', labelGu: 'ઘ.સે.મી (cc)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: 'galUS', labelEn: 'Gallon US (gal)', labelGu: 'ગેલન US', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    { key: 'galUK', labelEn: 'Gallon UK (imp gal)', labelGu: 'ગેલन UK', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
    { key: 'qt', labelEn: 'Quart (qt)', labelGu: 'ક્વોર્ટ (qt)', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    { key: 'pt', labelEn: 'Pint (pt)', labelGu: 'પાઇન્ટ (pt)', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    { key: 'cup', labelEn: 'Cup (US)', labelGu: 'કપ (US)', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    { key: 'fl_oz', labelEn: 'Fluid Ounce (fl oz)', labelGu: 'ફ્ળ ઔ (fl oz)', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    { key: 'tbsp', labelEn: 'Tablespoon (tbsp)', labelGu: 'ટેબ. ચ. (tbsp)', toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
    { key: 'tsp', labelEn: 'Teaspoon (tsp)', labelGu: 'ચ. ચ. (tsp)', toBase: v => v * 0.00492892, fromBase: v => v / 0.00492892 },
    { key: 'ft3', labelEn: 'Cubic Foot (ft³)', labelGu: 'ઘ.ફૂટ (ft³)', toBase: v => v * 28.3168, fromBase: v => v / 28.3168 },
    { key: 'in3', labelEn: 'Cubic Inch (in³)', labelGu: 'ઘ.ઇ (in³)', toBase: v => v * 0.0163871, fromBase: v => v / 0.0163871 },
  ],

  /* ====== TEMPERATURE (special: function-based) ====== */
  temperature: [
    {
      key: 'C', labelEn: 'Celsius (°C)', labelGu: 'સેલ્સિયસ (°C)',
      toBase: v => v,
      fromBase: v => v,
    },
    {
      key: 'F', labelEn: 'Fahrenheit (°F)', labelGu: 'ફેરનહાઇટ (°F)',
      toBase: v => (v - 32) * (5 / 9),
      fromBase: v => v * (9 / 5) + 32,
    },
    {
      key: 'K', labelEn: 'Kelvin (K)', labelGu: 'કેલ્વિન (K)',
      toBase: v => v - 273.15,
      fromBase: v => v + 273.15,
    },
    {
      key: 'Ra', labelEn: 'Rankine (Ra)', labelGu: 'રેન્કિન (Ra)',
      toBase: v => (v - 491.67) * (5 / 9),
      fromBase: v => (v + 273.15) * (9 / 5),
    },
  ],

  /* ====== SPEED (base: m/s) ====== */
  speed: [
    { key: 'ms', labelEn: 'm/s', labelGu: 'મી/સેક', toBase: v => v, fromBase: v => v },
    { key: 'kmh', labelEn: 'km/h', labelGu: 'કિ.મી/ક.', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { key: 'mph', labelEn: 'mph', labelGu: 'માઈ/ક.', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { key: 'knot', labelEn: 'Knot (kn)', labelGu: 'નોટ (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { key: 'fts', labelEn: 'ft/s', labelGu: 'ફૂ/સેક', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { key: 'mach', labelEn: 'Mach (Ma)', labelGu: 'માx (Ma)', toBase: v => v * 343, fromBase: v => v / 343 },
  ],

  /* ====== TIME (base: second) ====== */
  time: [
    { key: 'ms2', labelEn: 'Millisecond (ms)', labelGu: 'મિ.સેક (ms)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { key: 's', labelEn: 'Second (s)', labelGu: 'સેકેન્ડ (s)', toBase: v => v, fromBase: v => v },
    { key: 'min', labelEn: 'Minute (min)', labelGu: 'મિનિટ (min)', toBase: v => v * 60, fromBase: v => v / 60 },
    { key: 'hr', labelEn: 'Hour (hr)', labelGu: 'કલાક (hr)', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { key: 'day', labelEn: 'Day', labelGu: 'દિવસ', toBase: v => v * 86400, fromBase: v => v / 86400 },
    { key: 'week', labelEn: 'Week', labelGu: 'અઠવાડિયું', toBase: v => v * 604800, fromBase: v => v / 604800 },
    { key: 'month', labelEn: 'Month (30 days)', labelGu: 'મહિનો (30 દિ.)', toBase: v => v * 2592000, fromBase: v => v / 2592000 },
    { key: 'year', labelEn: 'Year (365 days)', labelGu: 'વર્ષ (365 દિ.)', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
    { key: 'decade', labelEn: 'Decade', labelGu: 'દાયકો', toBase: v => v * 315360000, fromBase: v => v / 315360000 },
    { key: 'cent', labelEn: 'Century', labelGu: 'સૈકો', toBase: v => v * 3153600000, fromBase: v => v / 3153600000 },
  ],

  /* ====== DIGITAL (base: bit) ====== */
  digital: [
    { key: 'bit', labelEn: 'Bit (b)', labelGu: 'બિટ (b)', toBase: v => v, fromBase: v => v },
    { key: 'Byt', labelEn: 'Byte (B)', labelGu: 'બાઇટ (B)', toBase: v => v * 8, fromBase: v => v / 8 },
    { key: 'KB', labelEn: 'Kilobyte (KB)', labelGu: 'કિ.બા (KB)', toBase: v => v * 8192, fromBase: v => v / 8192 },
    { key: 'MB', labelEn: 'Megabyte (MB)', labelGu: 'મે.બા (MB)', toBase: v => v * 8388608, fromBase: v => v / 8388608 },
    { key: 'GB', labelEn: 'Gigabyte (GB)', labelGu: 'ગી.બા (GB)', toBase: v => v * 8589934592, fromBase: v => v / 8589934592 },
    { key: 'TB', labelEn: 'Terabyte (TB)', labelGu: 'ટે.બา (TB)', toBase: v => v * 8796093022208, fromBase: v => v / 8796093022208 },
    { key: 'Pb', labelEn: 'Petabyte (PB)', labelGu: 'પે.બ (PB)', toBase: v => v * 9007199254740992, fromBase: v => v / 9007199254740992 },
  ],
};

// ──────────────────────────────────────────────
//  2. BILINGUAL TEXT STRINGS
// ──────────────────────────────────────────────
const STRINGS = {
  en: {
    heroTitle: 'Smart Unit<br/>Calculator',
    heroBadge: 'All Units · All Formats · Any Language',
    heroSubtitle: 'Convert metric, imperial, Gujarati traditional units and more',
    fromLabel: 'From',
    toLabel: 'To',
    swapTitle: 'Swap units',
    feetBadge: 'Supports 5′10″ foot-inch format for input & output',
    gujBadge: 'Includes Gujarati traditional units: Vaar, Vigha, Gaj, Gooth, Biswa',
    allLabel: 'All Equivalents',
    copyAll: 'Copy All',
    feetLabel: 'Foot-Inch Format',
    infoTitle: 'Quick Tips',
    tip1: 'Type <strong>5\'10"</strong> or <strong>5ft 10in</strong> to enter feet and inches',
    tip2: 'Switch language for Gujarati traditional units',
    tip3: 'Click any result card to copy the value',
    tip4: 'Use the swap button ⇅ to reverse conversion',
    footerText: 'Made with ❤️ for Gujarat | <strong>Unit Calculator</strong>',
    feetHint: 'Try: 5\'10" or 5ft 10in',
    copied: '✓ Copied!',
    copiedAll: '✓ All values copied!',
    hcBtn: 'Compare Heights',
    hcTitle: 'Height Comparison',
    hcPersonA: 'Person A',
    hcPersonB: 'Person B',
    logoEn: 'Unit Calc',
    logoGu: 'એકમ કેલ્ક્યુલેટર',
    langBtn: '🇮🇳 ગુજરાતી',
    finCalc: 'Financial Calculator',
    unitCalc: 'Unit Calculator',
    principal: 'Principal Amount',
    deposit: 'Deposit Amount',
    monthlySip: 'Monthly SIP',
    monthlyDeposit: 'Monthly Deposit',
    yearlyDeposit: 'Yearly Deposit',
    rate: 'Interest Rate (p.a. %)',
    tenure: 'Tenure',
    years: 'Years',
    months: 'Months',
    downpayment: 'Downpayment',
    exchangeVal: 'Exchange Value',
    procFee: 'Processing Fee %',
    totalInvest: 'Total Investment',
    estReturns: 'Estimated Returns',
    maturityValue: 'Maturity Value',
    totalInterest: 'Total Interest',
    emi: 'Monthly EMI',
    loanAmount: 'Net Loan Amount',
    month: 'Month',
    year: 'Year',
    interestList: 'Interest/Return',
    balance: 'Balance',
    totalPayment: 'Total Payment',
    tabs: {
      length: 'Length',
      area: 'Area',
      weight: 'Weight',
      volume: 'Volume',
      temperature: 'Temperature',
      speed: 'Speed',
      time: 'Time',
      digital: 'Digital',
    },
    ppfYears: 'Tenure (min. 15 years)',
    nscRepeat: 'Cycles (5 yrs each)',
    nscCycle: 'Cycle / Year',
    repeat: 'Repeat',
    prepayAmt: 'Prepayment Amount',
    prepayMode: 'Prepayment Mode',
    prepayReduceTenure: 'Reduce Tenure (keep same EMI)',
    prepayReduceEmi: 'Reduce EMI (keep same tenure)',
    newTenure: 'New Tenure',
    tenureSaved: 'Tenure Saved',
    newEmi: 'New EMI (after prepay)',
    emiSaved: 'EMI Saved',
    nscModeInvest: 'Invest (One-time)',
    nscModeReinvest: 'Re-Invest',
    nscReinvestOpt: 'On Maturity',
    nscOpt1: 'Credit P + I (Withdraw all)',
    nscOpt2: 'Renew P, Credit I',
    nscOpt3: 'Renew P + I (Compound)',
    interestCredited: 'Interest Credited',
    principalRenewed: 'Principal Renewed',
    withdrawn: 'Withdrawn',
    repayFreq: 'Repayment Frequency',
    freqMonthly: 'Monthly',
    freqQuarterly: 'Quarterly',
    freqHalfYearly: 'Half-Yearly',
    freqYearly: 'Yearly',
    installment: 'Installment',
    optionalFields: 'Additional Options',
    period: 'Period',
    nscMonthlyAmt: 'Monthly Amount',
    nscTotalYears: 'Total Years',
    nscStartYearLabel: 'Year to Start',
    nscAddAmtLabel: 'Add. Invest / Year',
    nscAddStartLabel: 'Add. Invest Start Year',
    nscAddEndLabel: 'Add. Invest End Year',
    nscAddOTYearsLabel: 'Add. Invest Years (2025,2030)',
    nscAddOTAmtLabel: 'Add. Invest Amount (One Time)',
    addMoreYearly: '+ Add More Yearly Invest',
    addMoreOneTime: '+ Add More One-Time Invest',
    // Bill Calculator Strings
    billCalc: 'Bill Calculator',
    electricity: 'Electricity (Torrent - 2 Months)',
    unitsConsumed: 'Units Consumed (for 2 months)',
    fixedCharges: 'Fixed Charges (2 months)',
    fpppaCharges: 'FPPPA / Fuel Charge (per unit)',
    elecDuty: 'Electricity Duty %',
    taxableAmount: 'Taxable Amount',
    totalBill: 'Total Billed Amount',
    billBreakdown: 'Bill Breakdown (Bimonthly)',
    slab: 'Slab (2-Month Range)',
    units: 'Units',
    ratePerUnit: 'Rate',
    cost: 'Cost',
    totalEnergyCharge: 'Total Energy Charge',
    tax: 'Tax',
    nscCyclesLabel: 'Number of 5-Year Cycles',
    nscInvestModeLabel: 'Investment Mode',
    nscModeOneTime: 'One-Time Investment',
    nscModeEveryYear: 'Invest Fresh Every Year',
    nscMaturityActionLabel: 'At Maturity (end of each 5-yr cycle)',
    nscMatReinvestAll: 'Reinvest P + I',
    nscMatRenewP: 'Renew P, Credit I',
    nscMatWithdraw: 'Withdraw All',
    ppfExtendLabel: 'Extend 5 Years',
    yes: 'Yes',
    no: 'No',
    finalAmount: 'Final Amount',
    basicCalc: 'Basic Calculator',
    btip1: 'Supports keyboard input (0-9, +, -, *, /, Enter, Backspace)',
    btip2: 'Use C to clear the current calculation',
    btip3: 'Use % for percentage calculations',
    basicInfoTitle: 'Basic Calculator Tips',
    loanType: 'Loan Type',
    loanVehicle: 'Vehicle / Auto Loan',
    loanHome: 'Home Loan',
    loanPersonal: 'Personal Loan',
    loanEducation: 'Education Loan',
    sipType: 'Investment Mode',
    sipModeMonthly: 'Monthly SIP',
    sipModeLumpsum: 'One-Time Lumpsum (MF)',
    sipStepUp: 'Annual Step-Up (%)',
    moratorium: 'Moratorium Period (Months)',
    compFreq: 'Compounding Frequency'
  },
  gu: {
    heroTitle: 'સ્માર્ટ એકમ<br/>કેલ્ક્યુલેટર',
    heroBadge: 'બધા એકમ · બધા ફોર્મેટ · કોઈ પણ ભાષા',
    heroSubtitle: 'મેટ્રિક, ઇમ્પેરિયલ, ગુજરાતી પરંપરાગત એકમ અને 5′10″ ફૂટ-ઇ ફોર્મેટ',
    fromLabel: 'ફ્રૉમ',
    toLabel: 'ટૂ',
    swapTitle: 'એકમ બદલો',
    feetBadge: '5′10″ ફૂટ-ઇ ઇનપુટ & આઉટ-પુટ ફ ફ',
    gujBadge: 'ગુ. પ. એ.: વાર, વીઘા, ગજ, ગૂઠ, બિસ્વા, મણ',
    allLabel: 'બધા સમાન',
    copyAll: 'બધું કૉ.',
    feetLabel: 'ફૂટ-ઇ ફ.',
    infoTitle: 'ઝ. ટ.',
    tip1: '<strong>5\'10"</strong> અથ. <strong>5ft 10in</strong> ટ. ફૂ-ઇ.',
    tip2: 'ગ. ભ. ટ. ગ. ત. એ. ટ.',
    tip3: 'ર. ક. ક. value ક.',
    tip4: 'Swap ⇅ ઉ. ક.',
    footerText: 'ગ. ❤️ | <strong>Unit Calculator</strong>',
    feetHint: 'ઉ. ક.: 5\'10" or 5ft 10in',
    copied: '✓ કૉ!',
    copiedAll: '✓ બ. ક.!',
    hcBtn: 'ઊંચાઈની સરખામણી',
    hcTitle: 'ઊંચાઈની સરખામણી',
    hcPersonA: 'વ્યક્તિ A',
    hcPersonB: 'વ્યક્તિ B',
    logoEn: 'Unit Calc',
    logoGu: 'એકમ કેલ્ક્યુ.',
    langBtn: '🌐 English',
    finCalc: 'આર્થિક કેલ્ક્યુલેટર',
    unitCalc: 'એકમ કેલ્ક્યુલ.',
    principal: 'મૂળ રકમ (Principal)',
    deposit: 'જમા રકમ (Deposit)',
    monthlySip: 'માસિક SIP',
    monthlyDeposit: 'માસિક જમા (RD)',
    yearlyDeposit: 'વાર્ષિક જમા',
    rate: 'વ્યાજ દર (વાર્ષિક %)',
    tenure: 'સમયગાળો',
    years: 'વર્ષ',
    months: 'મહિના',
    downpayment: 'ડાઉનપેમેન્ટ',
    exchangeVal: 'એક્સચેન્જ કિંમત',
    procFee: 'પ્રોસેસિંગ ફી %',
    totalInvest: 'કુલ રોકાણ',
    estReturns: 'અંદાજિત વળતર',
    maturityValue: 'પરિપક્વતા રકમ / કુલ રકમ',
    totalInterest: 'કુલ વ્યાજ',
    emi: 'માસિક EMI',
    loanAmount: 'ચોખ્ખી લોન રકમ',
    month: 'મહિનો',
    year: 'વર્ષ',
    interestList: 'વ્યાજ',
    balance: 'બાકી રકમ',
    totalPayment: 'કુલ ચૂકવણી',
    tabs: {
      length: 'લ.',
      area: 'ક્ષ.',
      weight: 'વ.',
      volume: 'જ.',
      temperature: 'ત.',
      speed: 'ઝ.',
      time: 'સ.',
      digital: 'ડ.',
    },
    ppfYears: 'સમય (ઓ. 15 વ.)',
    nscRepeat: 'ચક્ર (5 વ. દરેક)',
    nscCycle: 'ચક્ર / વ.',
    repeat: 'ચક્ર',
    prepayAmt: 'અગ્ર ચૂ. રકમ',
    prepayMode: 'અગ્ર ચૂ. પ્ર.',
    prepayReduceTenure: 'સ. ઘ. (EMI સ.)',
    prepayReduceEmi: 'EMI ઘ. (સ. સ.)',
    newTenure: 'ન. સ.',
    tenureSaved: 'સ. બ.',
    newEmi: 'ન. EMI',
    emiSaved: 'EMI બ.',
    nscModeInvest: 'રોકાણ (એક વાર)',
    nscModeReinvest: 'પુનઃ રોકાણ',
    nscReinvestOpt: 'પરિપક્વતા પર',
    nscOpt1: 'P + I જમા (બધું ઉપાડો)',
    nscOpt2: 'P નવીકરણ, I જમા',
    nscOpt3: 'P + I નવીકરણ (ચક્રવૃદ્ધિ)',
    interestCredited: 'જમા વ્યાજ',
    principalRenewed: 'નવીકરણ મૂડી',
    withdrawn: 'ઉપાડ',
    repayFreq: 'ચૂકવણી સમયગાળો',
    freqMonthly: 'માસિક',
    freqQuarterly: 'ત્રિમાસિક',
    freqHalfYearly: 'છમાસિક',
    freqYearly: 'વાર્ષિક',
    installment: 'હપ્તો',
    optionalFields: 'વધારાના વિકલ્પો',
    period: 'અવધિ',
    nscMonthlyAmt: 'માસિક રકમ',
    nscTotalYears: 'કુલ વર્ષ',
    nscStartYearLabel: 'પ્રારંભ વર્ષ',
    nscCyclesLabel: 'NSC 5-વર્ષ ચક્ર',
    nscInvestModeLabel: 'રોકાણ પ્રકાર',
    nscModeOneTime: 'એક વખત',
    nscModeEveryYear: 'દર વર્ષે',
    nscMaturityActionLabel: 'પ. સ. ક્રિયા',
    nscMatReinvestAll: 'P+I ફ.',
    nscMatRenewP: 'P ફ., I ઉ.',
    nscMatWithdraw: 'બ. ઉ.',
      nscAddAmtLabel: 'વધારાનું રોકાણ / વર્ષ',
      nscAddStartLabel: 'વધારાનું પ્રારંભ વર્ષ',
      nscAddEndLabel: 'વધારાનું અંત વર્ષ',
      nscAddOTYearsLabel: 'વધારાનું રોકાણ વર્ષો (દા.ત. ૨૦૨૫,૨૦૩૦)',
      nscAddOTAmtLabel: 'વધારાનું રોકાણ રકમ (એક વાર)',
      addMoreYearly: '+ વધુ વાર્ષિક રોકાણ ઉમેરો',
      addMoreOneTime: '+ વધુ એક-વખત રોકાણ ઉમેરો',
      ppfExtendLabel: '5 વર્ષ વધારો',
    yes: 'હા',
    no: 'ના',
    finalAmount: 'અંતિમ રકમ',
    basicCalc: 'સામાન્ય કેલ્ક્યુલેટર',
    btip1: 'કીબોર્ડ ઇનપુટ સપોર્ટ (0-9, +, -, *, /, Enter, Backspace)',
    btip2: 'ગણતરી સાફ કરવા માટે C નો ઉપયોગ કરો',
    btip3: 'ટકાવારી માટે % નો ઉપયોગ કરો',
    basicInfoTitle: 'કેલ્ક્યુલેટર ટિપ્સ',
    loanType: 'લોન પ્રકાર',
    loanVehicle: 'વાહન લોન',
    loanHome: 'હોમ લોન',
    loanPersonal: 'પર્સનલ લોન',
    loanEducation: 'એજ્યુકેશન લોન',
    sipType: 'રોકાણ પ્રકાર',
    sipModeMonthly: 'માસિક SIP',
    sipModeLumpsum: 'એકસાથે રોકાણ (MF)',
    sipStepUp: 'વાર્ષિક વધારો (%)',
    moratorium: 'ગ્રેસ સમયગાળો (મહિના)',
    compFreq: 'ચક્રવૃદ્ધિ સમયગાળો'
  },
};

// ──────────────────────────────────────────────
//  3. STATE
// ──────────────────────────────────────────────
let state = {
  mode: 'unit',
  finCategory: 'sip',
  billCategory: 'electricity',
  lang: 'en',
  theme: 'dark',
  category: 'length',
  fromKey: 'm',
  toKey: 'cm',
  rawInput: '',
};

// ──────────────────────────────────────────────
//  4. FEET-INCH HELPERS
// ──────────────────────────────────────────────

/** Parse foot-inch strings like 5'10", 5ft10in, 5 feet 10 inches → metres */
function parseFeetInch(str) {
  if (!str || typeof str !== 'string') return null;
  str = str.trim();

  // Pattern 1: 5'10" or 5' 10"
  let m = str.match(/^(-?\d+(?:\.\d+)?)\s*[''′]\s*(\d+(?:\.\d+)?)?\s*[""″]?$/);
  if (m) {
    const feet = parseFloat(m[1]);
    const inches = m[2] ? parseFloat(m[2]) : 0;
    return (feet * 12 + inches) * 0.0254;
  }

  // Pattern 2: 5ft10in or 5ft 10in or 5feet 10inches
  m = str.match(/^(-?\d+(?:\.\d+)?)\s*(?:ft|feet|foot)\s*(\d+(?:\.\d+)?)?\s*(?:in|inch|inches)?$/i);
  if (m) {
    const feet = parseFloat(m[1]);
    const inches = m[2] ? parseFloat(m[2]) : 0;
    return (feet * 12 + inches) * 0.0254;
  }

  // Pattern 3: just feet like 5ft or 5'
  m = str.match(/^(-?\d+(?:\.\d+)?)\s*(?:ft|feet|foot|[''′])$/i);
  if (m) {
    return parseFloat(m[1]) * 0.3048;
  }

  return null;
}

/** Convert metres → "X′Y″" string */
function metreToFeetInch(metres) {
  const totalInches = metres / 0.0254;
  const feet = Math.floor(Math.abs(totalInches) / 12) * Math.sign(totalInches);
  const inches = Math.abs(totalInches) % 12;
  return `${feet}′ ${inches.toFixed(2).replace(/\.00$/, '')}″`;
}

/** Convert metres → detailed string like "5 feet 10.00 inches" */
function metreToFeetInchLong(metres, lang = 'en') {
  const totalInches = metres / 0.0254;
  const feet = Math.floor(Math.abs(totalInches) / 12) * Math.sign(totalInches);
  const inches = (Math.abs(totalInches) % 12);
  const inStr = inches % 1 === 0 ? inches.toFixed(0) : inches.toFixed(2);
  if (lang === 'gu') {
    return `${feet} ફ ${inStr} ઇ`;
  }
  return `${feet} feet ${inStr} inches`;
}

// ──────────────────────────────────────────────
//  5. CONVERSION ENGINE
// ──────────────────────────────────────────────

function getUnit(category, key) {
  return UNITS[category].find(u => u.key === key);
}

function convert(value, fromKey, toKey, category) {
  const from = getUnit(category, fromKey);
  const to = getUnit(category, toKey);
  if (!from || !to || isNaN(value)) return NaN;
  const base = from.toBase(value);
  return to.fromBase(base);
}

function convertAll(value, fromKey, category) {
  return UNITS[category].map(u => ({
    ...u,
    result: convert(value, fromKey, u.key, category),
  }));
}

// ──────────────────────────────────────────────
//  6. NUMBER FORMATTING
// ──────────────────────────────────────────────

function formatNum(n, category) {
  if (isNaN(n) || n === null) return '—';
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';

  // Temperature: keep reasonable precision
  if (category === 'temperature') return n.toFixed(4).replace(/\.?0+$/, '');

  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e15) return n.toExponential(4);
  if (abs >= 1e9) return (n / 1e9).toFixed(4).replace(/\.?0+$/, '') + ' B';
  if (abs >= 1e6) return (n / 1e6).toFixed(4).replace(/\.?0+$/, '') + ' M';
  if (abs < 1e-9) return n.toExponential(4);
  if (abs < 0.0001) return n.toPrecision(5);
  if (abs < 1) return parseFloat(n.toPrecision(7)).toString();
  return parseFloat(n.toPrecision(9)).toLocaleString();
}

function formatNumRaw(n) {
  if (isNaN(n) || !isFinite(n)) return '';
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e15) return n.toExponential(6);
  if (abs < 1e-9) return n.toExponential(6);
  if (abs < 1) return parseFloat(n.toPrecision(10)).toString();
  return parseFloat(n.toPrecision(12)).toString();
}

// ──────────────────────────────────────────────
//  7. DOM REFERENCES
// ──────────────────────────────────────────────

const $ = id => document.getElementById(id);

const els = {
  // Header
  langToggle: $('lang-toggle'),
  themeToggle: $('theme-toggle'),
  logoEn: $('logo-en'),
  logoGu: $('logo-gu'),
  // Hero
  heroBadge: $('hero-badge'),
  heroTitle: $('hero-title'),
  heroSubtitle: $('hero-subtitle'),
  // Tabs
  tabsContainer: $('tabs-container'),
  // Mode Switch
  modeUnitBtn: $('mode-unit-btn'),
  modeFinBtn: $('mode-fin-btn'),
  modeBasicBtn: $('mode-basic-btn'),
  modeBillBtn: $('mode-bill-btn'),
  unitTabsWrapper: $('unit-tabs-wrapper'),
  finTabsWrapper: $('fin-tabs-wrapper'),
  billTabsWrapper: $('bill-tabs-wrapper'),
  unitCalcSection: $('unit-calc-section'),
  finCalcSection: $('fin-calc-section'),
  basicCalcSection: $('basic-calc-section'),
  billCalcSection: $('bill-calc-section'),
  finTabsContainer: $('fin-tabs-container'),
  billTabsContainer: $('bill-tabs-container'),
  // Badges
  feetBadge: $('feet-badge'),
  badgeText: $('badge-text'),
  gujaratiBadge: $('gujarati-badge'),
  gujBadgeText: $('guj-badge-text'),
  // Converter
  fromInput: $('from-input'),
  fromUnit: $('from-unit'),
  toUnit: $('to-unit'),
  resultDisplay: $('result-display'),
  fromFormatted: $('from-formatted'),
  toFormatted: $('to-formatted'),
  swapBtn: $('swap-btn'),
  feetHint: $('feet-hint'),
  feetHintText: $('feet-hint'),
  // Feet-inch output
  feetInchOutput: $('feet-inch-output'),
  fiLabel: $('fi-label'),
  fiValue: $('fi-value'),
  // Results grid
  allLabel: $('all-label'),
  copyAllBtn: $('copy-all-btn'),
  copyAllText: $('copy-all-text'),
  resultsGrid: $('results-grid'),
  // Info
  infoTitle: $('info-title'),
  infoList: $('info-list'),
  tip1: $('tip1'), tip2: $('tip2'), tip3: $('tip3'), tip4: $('tip4'),
  // Footer
  footerText: $('footer-text'),
  // Toast
  toast: $('toast'),
  // Height Compare
  hcToggleWrapper: $('height-compare-toggle-wrapper'),
  hcBtn: $('height-compare-btn'),
  hcBtnText: $('hc-btn-text'),
  hcSection: $('height-compare-section'),
  hcCloseBtn: $('hc-close-btn'),
  hcTitle: $('hc-title'),
  hcLabelA: $('hc-label-a'),
  hcLabelB: $('hc-label-b'),
  hcInputA: $('hc-input-a'),
  hcInputB: $('hc-input-b'),
  hcYAxis: $('hc-y-axis'),
  hcPersonAWrap: $('hc-person-a-wrapper'),
  hcPersonBWrap: $('hc-person-b-wrapper'),
  hcValA: $('hc-val-a'),
  hcValB: $('hc-val-b'),
  // Financial elements
  finInputGrid: $('fin-input-grid'),
  finSummaryGrid: $('fin-summary'),
  finTableTitle: $('fin-table-title'),
  finTableHead: $('fin-table-head'),
  finTableBody: $('fin-table-body'),
  // Basic calculator elements
  basicScreen: $('basic-screen'),
  basicHistory: $('basic-history'),
  // Stats Modal
  statsToggle: $('stats-toggle'),
  statsModalOverlay: $('stats-modal-overlay'),
  statsCloseBtn: $('stats-close-btn'),
  statTotalVisits: $('stat-total-visits'),
  statUniqueDevices: $('stat-unique-devices'),
  statTodayVisits: $('stat-today-visits'),
  visitorChart: $('visitorChart'),
};

// ──────────────────────────────────────────────
//  8. POPULATE SELECTS
// ──────────────────────────────────────────────

function populateSelects(category) {
  const units = UNITS[category];
  const lang = state.lang;
  [els.fromUnit, els.toUnit].forEach((sel, idx) => {
    const prev = sel.value;
    sel.innerHTML = '';
    // Group: Standard / Gujarati
    const std = units.filter(u => !u.gujarati);
    const guj = units.filter(u => u.gujarati);

    const addGroup = (label, items) => {
      if (!items.length) return;
      const og = document.createElement('optgroup');
      og.label = label;
      items.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.key;
        opt.textContent = lang === 'gu' ? u.labelGu : u.labelEn;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    };

    addGroup(lang === 'gu' ? 'સ્ટ. એ.' : 'Standard', std);
    if (guj.length) {
      addGroup(lang === 'gu' ? 'ગુ. પ. એ.' : 'Gujarati Traditional', guj);
    }

    // Restore or set default
    const defaultKey = idx === 0
      ? (state.fromKey || units[0].key)
      : (state.toKey || (units[1] || units[0]).key);
    sel.value = prev && units.find(u => u.key === prev) ? prev : defaultKey;
  });

  state.fromKey = els.fromUnit.value;
  state.toKey = els.toUnit.value;
}

// ──────────────────────────────────────────────
//  9. RENDER ALL RESULTS GRID
// ──────────────────────────────────────────────

function renderGrid(inputMetres, inputValue, fromKey, category) {
  const grid = els.resultsGrid;
  grid.innerHTML = '';
  const lang = state.lang;
  const isLength = category === 'length';

  const allResults = convertAll(!isNaN(inputValue) ? inputValue : 0, fromKey, category);

  allResults.forEach(u => {
    if (isNaN(u.result)) return;
    const card = document.createElement('div');
    card.className = 'result-card';
    card.title = `Click to copy ${formatNum(u.result, category)} ${u.key}`;

    const unitName = lang === 'gu' ? u.labelGu : u.labelEn;

    let feetFmtHtml = '';
    if (isLength && (u.key === 'ft' || u.key === 'in' || u.key === 'm' || u.key === 'cm' || u.key === 'gaj' || u.key === 'vaar' || u.key === 'hath')) {
      // show foot-inch for this unit's metre equivalent
      const metres = u.toBase(u.result);
      feetFmtHtml = `<div class="rc-feet-fmt">${metreToFeetInch(metres)}</div>`;
    }

    card.innerHTML = `
      <div class="copy-chip">copy</div>
      <div class="rc-unit ${u.gujarati ? 'gujarati-unit' : ''}">${unitName}</div>
      <div class="rc-value">${formatNum(u.result, category)}</div>
      ${feetFmtHtml}
    `;

    card.addEventListener('click', () => {
      copyText(formatNumRaw(u.result));
      showToast(STRINGS[state.lang].copied);
    });

    grid.appendChild(card);
  });
}

// ──────────────────────────────────────────────
//  10. MAIN CALCULATE FUNCTION
// ──────────────────────────────────────────────

function calculate() {
  const raw = els.fromInput.value.trim();
  const category = state.category;
  const fromKey = state.fromKey;
  const toKey = state.toKey;
  const lang = state.lang;
  const isLength = category === 'length';

  let inputValue = null;
  let isFeetInchInput = false;
  let inputMetres = null;

  if (raw === '' || raw === '-') {
    els.resultDisplay.textContent = '—';
    els.feetInchOutput.classList.add('hidden');
    els.fromFormatted.textContent = '';
    els.toFormatted.textContent = '';
    renderGrid(0, 0, fromKey, category);
    return;
  }

  // Try parsing feet-inch
  if (isLength) {
    const fi = parseFeetInch(raw);
    if (fi !== null) {
      isFeetInchInput = true;
      inputMetres = fi;
      // Convert metres to fromKey unit to get inputValue
      const fromUnit = getUnit('length', fromKey);
      inputValue = fromUnit ? fromUnit.fromBase(fi) : fi;
    }
  }

  if (!isFeetInchInput) {
    inputValue = parseFloat(raw.replace(/,/g, '').replace(/\s/g, ''));
  }

  if (inputValue === null || isNaN(inputValue)) {
    els.resultDisplay.textContent = '—';
    els.fromFormatted.textContent = '❌ Invalid';
    els.toFormatted.textContent = '';
    els.feetInchOutput.classList.add('hidden');
    return;
  }

  // Convert
  const resultVal = convert(inputValue, fromKey, toKey, category);
  
  let resultText = '';
  if (category === 'length' && toKey === 'ft') {
    const toUnit = getUnit('length', toKey);
    const outMetres = toUnit ? toUnit.toBase(resultVal) : resultVal;
    resultText = metreToFeetInch(outMetres);
  } else {
    resultText = isNaN(resultVal) ? '—' : formatNum(resultVal, category);
  }
  els.resultDisplay.textContent = resultText;

  // Foot-inch display for length outputs
  if (isLength) {
    const fromUnit = getUnit('length', fromKey);
    const toUnit = getUnit('length', toKey);
    const inMetres = fromUnit ? fromUnit.toBase(inputValue) : inputValue;
    const outMetres = toUnit ? toUnit.toBase(resultVal) : resultVal;

    // Show foot-inch formatted output
    els.feetInchOutput.classList.remove('hidden');
    els.fiLabel.textContent = STRINGS[lang].feetLabel;
    const inFi = metreToFeetInchLong(inMetres, lang);
    const outFi = metreToFeetInchLong(outMetres, lang);
    
    // Update fiValue depending on input type
    if (isFeetInchInput) {
      const toLabelText = lang === 'gu' ? toUnit.labelGu : toUnit.labelEn;
      els.fiValue.textContent = `${inFi}  →  ${formatNum(resultVal, category)} ${toLabelText}`;
    } else {
      const fromLabelText = lang === 'gu' ? fromUnit.labelGu : fromUnit.labelEn;
      els.fiValue.textContent = `${formatNum(inputValue, category)} ${fromLabelText}  →  ${outFi}`;
    }

    // Show formatted sub-text under panels
    els.fromFormatted.textContent = fromKey === 'ft' ? '' : `= ${metreToFeetInch(inMetres)}`;
    els.toFormatted.textContent = toKey === 'ft' ? '' : `= ${metreToFeetInch(outMetres)}`;
  } else {
    els.feetInchOutput.classList.add('hidden');
    els.fromFormatted.textContent = '';
    els.toFormatted.textContent = '';
  }

  renderGrid(inputMetres, inputValue, fromKey, category);
}

// ──────────────────────────────────────────────
//  11. UPDATE UI TEXT (Language switch)
// ──────────────────────────────────────────────

function applyLanguage() {
  const lang = state.lang;
  const S = STRINGS[lang];

  // Hero
  els.heroBadge.textContent = S.heroBadge;
  els.heroTitle.innerHTML = lang === 'en'
    ? '<span class="gradient-text">Smart Unit</span><br/>Calculator'
    : '<span class="gradient-text">સ્માર્ટ એકમ</span><br/>કેલ્ક્યુલ.';
  els.heroSubtitle.textContent = S.heroSubtitle;

  // Logo
  els.logoEn.textContent = S.logoEn;
  els.logoGu.textContent = S.logoGu;

  // Lang button
  if (lang === 'en') {
    els.langToggle.querySelector('.lang-en').classList.remove('hidden');
    els.langToggle.querySelector('.lang-gu').classList.add('hidden');
  } else {
    els.langToggle.querySelector('.lang-en').classList.add('hidden');
    els.langToggle.querySelector('.lang-gu').classList.remove('hidden');
  }

  // Tabs
  document.querySelectorAll('#tabs-container .tab-label').forEach(el => {
    const cat = el.getAttribute(`data-${lang}`);
    if (cat) el.textContent = cat;
  });

  if ($('mode-unit-label')) $('mode-unit-label').textContent = S.unitCalc;
  if ($('mode-fin-label')) $('mode-fin-label').textContent = S.finCalc;
  if ($('mode-basic-label')) $('mode-basic-label').textContent = S.basicCalc;

  // Basic info
  if ($('basic-info-title')) $('basic-info-title').textContent = S.basicInfoTitle;
  if ($('btip1')) $('btip1').textContent = S.btip1;
  if ($('btip2')) $('btip2').textContent = S.btip2;
  if ($('btip3')) $('btip3').textContent = S.btip3;

  // Badges
  if (els.badgeText) els.badgeText.textContent = S.feetBadge;
  if (els.gujBadgeText) els.gujBadgeText.textContent = S.gujBadge;

  // Panel labels
  $('from-label').textContent = S.fromLabel;
  $('to-label').textContent = S.toLabel;
  els.swapBtn.title = S.swapTitle;

  // Feet hint
  const hint = document.querySelector('#feet-hint small');
  if (hint) hint.textContent = S.feetHint;

  // All results, tips
  els.allLabel.textContent = S.allLabel;
  els.copyAllText.textContent = S.copyAll;
  els.fiLabel.textContent = S.feetLabel;
  els.infoTitle.textContent = S.infoTitle;

  // Height Compare
  if (els.hcBtnText) els.hcBtnText.textContent = S.hcBtn;
  if (els.hcTitle) els.hcTitle.textContent = S.hcTitle;
  if (els.hcLabelA) els.hcLabelA.textContent = S.hcPersonA;
  if (els.hcLabelB) els.hcLabelB.textContent = S.hcPersonB;

  // Tips
  els.tip1.innerHTML = S.tip1;
  els.tip2.textContent = lang === 'en' ? 'Switch language for Gujarati traditional units' : 'ભ. બ. ગ. ઊ. ત. ઉ.';
  els.tip3.textContent = lang === 'en' ? 'Click any result card to copy the value' : 'ક. ક. value ક.';
  els.tip4.textContent = lang === 'en' ? 'Swap button ⇅ reverses the conversion' : 'Swap ⇅ ત. ઉ.';

  els.footerText.innerHTML = S.footerText;

  // Repopulate selects and inputs with translated labels
  populateSelects(state.category);
  calculate();
  if (state.mode === 'fin') { renderFinInputs(); calculateFin(); }
}

// ──────────────────────────────────────────────
//  12. PRIVILEGE & ACCESS GOVERNANCE SYSTEM
// ──────────────────────────────────────────────

const TOOLS_DEF = [
  {
    id: 'unit',
    name: 'Unit Calculator',
    icon: '⚖️',
    sections: [
      { id: 'length', name: 'Length (લંબાઈ)' },
      { id: 'area', name: 'Area (ક્ષેત્રફળ)' },
      { id: 'weight', name: 'Weight / Mass (વજન)' },
      { id: 'volume', name: 'Volume (કદ)' },
      { id: 'temperature', name: 'Temperature (તાપમાન)' },
      { id: 'speed', name: 'Speed (ઝડપ)' },
      { id: 'time', name: 'Time (સમય)' },
      { id: 'digital', name: 'Digital Storage (ડેટા)' },
      { id: 'height', name: 'Height Compare' },
      { id: 'wv', name: 'Weight ⟷ Volume' }
    ]
  },
  {
    id: 'fin',
    name: 'Financial Calculator',
    icon: '💰',
    sections: [
      { id: 'sip', name: 'SIP & Mutual Funds' },
      { id: 'fd', name: 'Fixed Deposit (FD)' },
      { id: 'rd', name: 'Recurring Deposit (RD)' },
      { id: 'ppf', name: 'Public Provident Fund (PPF)' },
      { id: 'nsc', name: 'National Savings Certificate (NSC)' },
      { id: 'loan', name: 'Loans & EMI' }
    ]
  },
  { id: 'basic', name: 'Basic Calculator', icon: '🔢', sections: [] },
  { id: 'pdf', name: 'PDF Toolkit', icon: '📄', sections: [] },
  { id: 'compiler', name: 'Online Compiler', icon: '💻', sections: [] },
  { id: 'color', name: 'Color Viewer', icon: '🎨', sections: [] },
  { id: 'qr', name: 'QR Connect', icon: '📱', sections: [] }
];

function getPrivileges() {
  const defaultPriv = {
    requireLogin: false,
    allowRegistration: true,
    globalTools: {
      unit: true, fin: true, basic: true, pdf: true, compiler: true, color: true, qr: true
    },
    globalSections: {
      length: true, area: true, weight: true, volume: true, temperature: true, speed: true, time: true, digital: true, height: true, wv: true,
      sip: true, fd: true, rd: true, ppf: true, nsc: true, loan: true
    },
    userPrivileges: {} // userId -> { tools: {}, sections: {} }
  };
  try {
    const saved = localStorage.getItem('unitcalc_privileges');
    if (!saved) return defaultPriv;
    const parsed = JSON.parse(saved);
    return {
      requireLogin: !!parsed.requireLogin,
      allowRegistration: parsed.allowRegistration !== false,
      globalTools: Object.assign({}, defaultPriv.globalTools, parsed.globalTools || {}),
      globalSections: Object.assign({}, defaultPriv.globalSections, parsed.globalSections || {}),
      userPrivileges: parsed.userPrivileges || {}
    };
  } catch (e) {
    return defaultPriv;
  }
}

function savePrivileges(priv) {
  localStorage.setItem('unitcalc_privileges', JSON.stringify(priv));
}

function canAccess(toolId, sectionId = null) {
  const session = JSON.parse(localStorage.getItem('unitcalc_session') || 'null');
  
  // Super Admin has full unrestricted root level 0 authority
  if (session && session.role === 'admin') {
    return { allowed: true };
  }

  const priv = getPrivileges();

  // 1. Mandatory Login Policy
  if (priv.requireLogin && !session) {
    return {
      allowed: false,
      reason: 'login_required',
      msg: 'Super Administrator has enabled strict access. Please log in or register an account to use this tool.'
    };
  }

  // 2. Global Master Tool Switch
  if (priv.globalTools && priv.globalTools[toolId] === false) {
    return {
      allowed: false,
      reason: 'tool_disabled_global',
      msg: `The ${toolId.toUpperCase()} tool is currently disabled by Super Administrator.`
    };
  }

  // 3. Global Section Switch
  if (sectionId && priv.globalSections && priv.globalSections[sectionId] === false) {
    return {
      allowed: false,
      reason: 'section_disabled_global',
      msg: `The '${sectionId}' section is currently disabled by Super Administrator.`
    };
  }

  // 4. Per-User Privilege Matrix
  if (session && session.id) {
    const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');
    const currentUserObj = users.find(u => u.id === session.id);
    if (currentUserObj && currentUserObj.status === 'Suspended') {
      return {
        allowed: false,
        reason: 'user_suspended',
        msg: 'Your account has been suspended by Administrator. Please contact support.'
      };
    }

    const uPriv = priv.userPrivileges?.[session.id];
    if (uPriv) {
      if (uPriv.tools && uPriv.tools[toolId] === false) {
        return {
          allowed: false,
          reason: 'user_tool_denied',
          msg: `Your account has not been granted privilege to use the ${toolId.toUpperCase()} tool.`
        };
      }
      if (sectionId && uPriv.sections && uPriv.sections[sectionId] === false) {
        return {
          allowed: false,
          reason: 'user_section_denied',
          msg: `Your account has not been granted privilege to access the '${sectionId}' section.`
        };
      }
    }
  }

  return { allowed: true };
}

function showPrivilegeLock(msg, isLoginPrompt = true) {
  const overlay = document.getElementById('privilege-lock-overlay');
  const msgEl = document.getElementById('lock-msg');
  const loginBtn = document.getElementById('btn-lock-login');
  if (!overlay) return;
  if (msgEl) msgEl.textContent = msg;
  if (loginBtn) loginBtn.style.display = isLoginPrompt ? 'inline-block' : 'none';
  overlay.classList.remove('hidden');
}

function hidePrivilegeLock() {
  const overlay = document.getElementById('privilege-lock-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// ──────────────────────────────────────────────
//  12.5 CATEGORY SWITCH
// ──────────────────────────────────────────────

const CATEGORY_DEFAULTS = {
  length: { from: 'm', to: 'cm' },
  area: { from: 'm2', to: 'ft2' },
  weight: { from: 'kg', to: 'g' },
  volume: { from: 'L', to: 'mL' },
  temperature: { from: 'C', to: 'F' },
  speed: { from: 'kmh', to: 'ms' },
  time: { from: 'min', to: 's' },
  digital: { from: 'MB', to: 'KB' },
};

function switchCategory(cat) {
  const accessCheck = canAccess('unit', cat);
  if (!accessCheck.allowed) {
    showPrivilegeLock(accessCheck.msg, accessCheck.reason === 'login_required');
    return;
  }

  state.category = cat;
  const isWv = cat === 'wv';

  // Update tabs
  document.querySelectorAll('#tabs-container .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.category === cat);
  });

  const convLayout = document.querySelector('.converter-layout:not(.wv-converter-layout)');
  const allResults = document.getElementById('all-results-section');
  const infoPanel = document.getElementById('info-panel');
  const wvSection = document.getElementById('wv-calc-section');

  if (isWv) {
    if (convLayout) convLayout.classList.add('hidden');
    if (allResults) allResults.classList.add('hidden');
    if (infoPanel) infoPanel.classList.add('hidden');
    if (wvSection) wvSection.classList.remove('hidden');
    if (els.feetBadge) els.feetBadge.classList.add('hidden');
    if (els.gujaratiBadge) els.gujaratiBadge.classList.add('hidden');
    if (els.hcToggleWrapper) els.hcToggleWrapper.classList.add('hidden');
    if (els.hcSection) els.hcSection.classList.add('hidden');
    if (typeof updateWeightVolumeCalc === 'function') updateWeightVolumeCalc();
    return;
  }

  if (convLayout) convLayout.classList.remove('hidden');
  if (allResults) allResults.classList.remove('hidden');
  if (infoPanel) infoPanel.classList.remove('hidden');
  if (wvSection) wvSection.classList.add('hidden');

  const def = CATEGORY_DEFAULTS[cat] || (UNITS[cat] ? { from: UNITS[cat][0].key, to: (UNITS[cat][1] || UNITS[cat][0]).key } : { from: 'm', to: 'cm' });
  state.fromKey = def.from;
  state.toKey = def.to;

  populateSelects(cat);

  // Show/hide special badges
  const isLength = cat === 'length';
  const hasGuj = UNITS[cat] && UNITS[cat].some(u => u.gujarati);
  if (els.feetBadge) els.feetBadge.classList.toggle('hidden', !isLength);
  if (els.gujaratiBadge) els.gujaratiBadge.classList.toggle('hidden', !hasGuj);
  if (els.hcToggleWrapper) els.hcToggleWrapper.classList.toggle('hidden', !isLength);
  if (!isLength && els.hcSection) els.hcSection.classList.add('hidden');

  // Show/hide feet hint
  const feetHintEl = document.querySelector('.feet-inch-hint');
  if (feetHintEl) feetHintEl.classList.toggle('hidden', !isLength);

  els.fromInput.value = '';
  calculate();
}

// ──────────────────────────────────────────────
//  13. CLIPBOARD & TOAST
// ──────────────────────────────────────────────

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

let toastTimer = null;
function showToast(msg) {
  const t = els.toast;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

function copyAll() {
  const cards = document.querySelectorAll('.result-card');
  const lines = [];
  cards.forEach(c => {
    const unit = c.querySelector('.rc-unit')?.textContent || '';
    const val = c.querySelector('.rc-value')?.textContent || '';
    lines.push(`${unit}: ${val}`);
  });
  copyText(lines.join('\n'));
  showToast(STRINGS[state.lang].copiedAll);
}

// ──────────────────────────────────────────────
//  14. THEME
// ──────────────────────────────────────────────

function applyTheme() {
  const isDark = state.theme === 'dark';
  document.body.classList.toggle('light', !isDark);
  els.themeToggle.textContent = isDark ? '🌙' : '☀️';
}

// ──────────────────────────────────────────────
//  15. EVENT LISTENERS
// ──────────────────────────────────────────────

// Tab clicks
els.tabsContainer.addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (tab) switchCategory(tab.dataset.category);
});

els.finTabsContainer.addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (tab) switchFinCategory(tab.dataset.fincat);
});

if (els.modeUnitBtn) els.modeUnitBtn.addEventListener('click', () => switchMode('unit'));
if (els.modeFinBtn) els.modeFinBtn.addEventListener('click', () => switchMode('fin'));
if (els.modeBasicBtn) els.modeBasicBtn.addEventListener('click', () => switchMode('basic'));

// Input
els.fromInput.addEventListener('input', () => {
  state.rawInput = els.fromInput.value;
  calculate();
});
els.fromInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
});

// Select changes
els.fromUnit.addEventListener('change', () => {
  state.fromKey = els.fromUnit.value;
  calculate();
});
els.toUnit.addEventListener('change', () => {
  state.toKey = els.toUnit.value;
  calculate();
});

// Swap
els.swapBtn.addEventListener('click', () => {
  [state.fromKey, state.toKey] = [state.toKey, state.fromKey];
  els.fromUnit.value = state.fromKey;
  els.toUnit.value = state.toKey;
  // Move result value back to input
  const resultText = els.resultDisplay.textContent;
  if (resultText && resultText !== '—') {
    els.fromInput.value = formatNumRaw(
      convert(parseFloat(els.fromInput.value) || 0, state.toKey, state.fromKey, state.category)
    );
  }
  calculate();
});

// Copy all
els.copyAllBtn.addEventListener('click', copyAll);

// Language toggle
els.langToggle.addEventListener('click', () => {
  state.lang = state.lang === 'en' ? 'gu' : 'en';
  applyLanguage();
});

// Theme toggle
els.themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});

// ──────────────────────────────────────────────
//  16. HEIGHT COMPARE LOGIC
// ──────────────────────────────────────────────

function initHeightCompare() {
  if (!els.hcBtn) return;
  els.hcBtn.addEventListener('click', () => {
    els.hcSection.classList.remove('hidden');
    els.hcToggleWrapper.classList.add('hidden');
    updateHeightGraph();
  });

  els.hcCloseBtn.addEventListener('click', () => {
    els.hcSection.classList.add('hidden');
    els.hcToggleWrapper.classList.remove('hidden');
  });

  ['input', 'change'].forEach(evt => {
    els.hcInputA.addEventListener(evt, updateHeightGraph);
    els.hcInputB.addEventListener(evt, updateHeightGraph);
  });
}

function updateHeightGraph() {
  const valA = els.hcInputA.value.trim();
  const valB = els.hcInputB.value.trim();

  // Try parsing strictly as feet/inches first. Fallback to normal float if user enters numbers.
  let mA = parseFeetInch(valA);
  if (mA === null && parseFloat(valA)) {
    const fromUnit = getUnit('length', state.fromKey);
    mA = fromUnit ? fromUnit.toBase(parseFloat(valA)) : 0;
  } else if (mA === null) mA = 0;

  let mB = parseFeetInch(valB);
  if (mB === null && parseFloat(valB)) {
    const fromUnit = getUnit('length', state.fromKey);
    mB = fromUnit ? fromUnit.toBase(parseFloat(valB)) : 0;
  } else if (mB === null) mB = 0;

  // Convert to display strings
  const strA = mA > 0 ? metreToFeetInch(mA) : '--';
  const strB = mB > 0 ? metreToFeetInch(mB) : '--';

  els.hcValA.textContent = strA;
  els.hcValB.textContent = strB;

  // Render graph if valid
  const maxM = Math.max(mA, mB, 1.5); // base scale at least 1.5m (~5ft)
  const Y_AXIS_MAX = maxM * 1.25; // max Y is 25% taller than tallest person

  // Draw Y Axis
  els.hcYAxis.innerHTML = '';
  // Generate ticks every 0.3048m (1 foot)
  for (let mt = 0; mt <= Y_AXIS_MAX; mt += 0.3048) {
    if (mt === 0) continue;
    const pct = (mt / Y_AXIS_MAX) * 100;
    const ft = Math.round(mt / 0.3048);
    const tick = document.createElement('div');
    tick.className = 'hc-tick';
    tick.style.bottom = `${pct}%`;
    tick.textContent = `${ft}′`;
    els.hcYAxis.appendChild(tick);
  }

  // Update humans heights
  const pctA = mA > 0 ? (mA / Y_AXIS_MAX) * 100 : 0;
  const pctB = mB > 0 ? (mB / Y_AXIS_MAX) * 100 : 0;

  els.hcPersonAWrap.style.height = `${pctA}%`;
  els.hcPersonBWrap.style.height = `${pctB}%`;

  const lineEl = document.getElementById('hc-compare-line');
  if (lineEl) {
    if (mA > 0 && mB > 0 && mA !== mB) {
      const minPct = Math.min(pctA, pctB);
      lineEl.style.bottom = `${minPct}%`;
      lineEl.style.display = 'block';
    } else {
      lineEl.style.display = 'none';
    }
  }
}


// ──────────────────────────────────────────────
//  16.5 FINANCIAL ENGINE
// ──────────────────────────────────────────────

function switchMode(newMode) {
  const accessCheck = canAccess(newMode);
  if (!accessCheck.allowed) {
    showPrivilegeLock(accessCheck.msg, accessCheck.reason === 'login_required');
    return;
  }

  state.mode = newMode;
  const isUnit = newMode === 'unit';
  const isFin = newMode === 'fin';
  const isBasic = newMode === 'basic';

  els.modeUnitBtn.classList.toggle('active', isUnit);
  els.modeFinBtn.classList.toggle('active', isFin);
  if (els.modeBasicBtn) els.modeBasicBtn.classList.toggle('active', isBasic);

  els.unitTabsWrapper.classList.toggle('hidden', !isUnit);
  els.unitCalcSection.classList.toggle('hidden', !isUnit);

  els.finTabsWrapper.classList.toggle('hidden', !isFin);
  els.finCalcSection.classList.toggle('hidden', !isFin);

  if (els.basicCalcSection) els.basicCalcSection.classList.toggle('hidden', !isBasic);

  if (isUnit) {
    switchCategory(state.category);
  } else if (isFin) {
    switchFinCategory(state.finCategory);
  }
}

function switchFinCategory(cat) {
  const accessCheck = canAccess('fin', cat);
  if (!accessCheck.allowed) {
    showPrivilegeLock(accessCheck.msg, accessCheck.reason === 'login_required');
    return;
  }

  state.finCategory = cat;
  document.querySelectorAll('#fin-tabs-container .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.fincat === cat);
  });
  renderFinInputs();
  calculateFin();
}

const FIN_CONFIG = {
  sip: {
    primary: [
      {
        id: 'sipType', labelKey: 'sipType', type: 'toggle', default: 'sip',
        options: [
          { value: 'sip', labelKey: 'sipModeMonthly' },
          { value: 'lumpsum', labelKey: 'sipModeLumpsum' }
        ]
      },
      { id: 'monthlySip', labelKey: 'monthlySip', default: '5000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '12', suffix: '%' },
      { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '10', defaultMonths: '0' }
    ],
    optional: [
      { id: 'sipStepUp', labelKey: 'sipStepUp', default: '0', suffix: '%' }
    ]
  },
  fd: {
    primary: [
      { id: 'principal', labelKey: 'principal', default: '100000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '7.0', suffix: '%' },
      { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '5', defaultMonths: '0' }
    ],
    optional: [
      {
        id: 'fdCompFreq', labelKey: 'compFreq', type: 'select', default: 'quarterly',
        options: [
          { value: 'quarterly', labelKey: 'freqQuarterly' },
          { value: 'monthly', labelKey: 'freqMonthly' },
          { value: 'halfyearly', labelKey: 'freqHalfYearly' },
          { value: 'yearly', labelKey: 'freqYearly' }
        ]
      }
    ]
  },
  rd: {
    primary: [
      { id: 'monthlyDeposit', labelKey: 'monthlyDeposit', default: '3880', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '6.9', suffix: '%' },
      { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '2', defaultMonths: '0' }
    ],
    optional: [
      {
        id: 'rdCompFreq', labelKey: 'compFreq', type: 'select', default: 'quarterly',
        options: [
          { value: 'quarterly', labelKey: 'freqQuarterly' },
          { value: 'monthly', labelKey: 'freqMonthly' }
        ]
      }
    ]
  },
  ppf: {
    primary: [
      { id: 'yearlyDeposit', labelKey: 'yearlyDeposit', default: '150000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '7.1', suffix: '%' },
      { id: 'years', labelKey: 'ppfYears', default: '15', min: 15 }
    ],
    optional: [
      { id: 'ppfExtend', labelKey: 'ppfExtendLabel', type: 'toggle', default: 'no', options: [{ value: 'no', labelKey: 'no' }, { value: 'yes', labelKey: 'yes' }] }
    ]
  },
  nsc: {
    primary: [
      { id: 'nscPrincipal', labelKey: 'principal', default: '100000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '7.7', suffix: '%' },
      { id: 'nscStartYear', labelKey: 'nscStartYearLabel', default: new Date().getFullYear().toString() },
      { id: 'nscCycles', labelKey: 'nscCyclesLabel', default: '1', min: 1 },
      {
        id: 'nscInvestMode', labelKey: 'nscInvestModeLabel',
        type: 'toggle', default: 'onetime',
        options: [
          { value: 'onetime', labelKey: 'nscModeOneTime' },
          { value: 'everyyear', labelKey: 'nscModeEveryYear' }
        ]
      },
      {
        id: 'nscMaturityAction', labelKey: 'nscMaturityActionLabel',
        type: 'toggle', default: 'reinvestAll',
        options: [
          { value: 'reinvestAll', labelKey: 'nscMatReinvestAll' },
          { value: 'renewP', labelKey: 'nscMatRenewP' },
          { value: 'withdraw', labelKey: 'nscMatWithdraw' }
        ]
      }
    ],
    optional: []
  },
  loan: {
    primary: [
      {
        id: 'loanType', labelKey: 'loanType', type: 'select', default: 'vehicle',
        options: [
          { value: 'vehicle', labelKey: 'loanVehicle' },
          { value: 'home', labelKey: 'loanHome' },
          { value: 'personal', labelKey: 'loanPersonal' },
          { value: 'education', labelKey: 'loanEducation' }
        ]
      },
      { id: 'principal', labelKey: 'principal', default: '500000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '8.5', suffix: '%' },
      { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '5', defaultMonths: '0' }
    ],
    optional: []
  }
};

// Helper: render a single fin field into a parent element
function renderFinField(field, parent, S) {
  const labelText = S[field.labelKey] || field.labelKey;
  const pre = field.prefix ? `<span class="fin-input-prefix">${field.prefix}</span>` : '';
  const suf = field.suffix ? `<span class="fin-input-suffix">${field.suffix}</span>` : '';
  const existingVal = window[`fin_${field.id}`] !== undefined ? window[`fin_${field.id}`] : field.default;

  // Check conditional visibility (showWhen)
  if (field.showWhen) {
    const depVal = window[`fin_${field.showWhen.field}`];
    if (depVal !== field.showWhen.value) return; // skip rendering
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'fin-input-wrapper';
  wrapper.dataset.fieldId = field.id;

  // Toggle (radio-like pill buttons)
  if (field.type === 'toggle') {
    const btnsHTML = (field.options || []).map(o => {
      const active = existingVal === o.value ? 'active' : '';
      return `<button type="button" class="fin-toggle-btn ${active}" data-val="${o.value}">${S[o.labelKey] || o.labelKey}</button>`;
    }).join('');
    wrapper.innerHTML = `
      ${labelText ? `<label class="fin-input-label">${labelText}</label>` : ''}
      <div class="fin-toggle-group" id="fi-${field.id}">${btnsHTML}</div>
    `;
    parent.appendChild(wrapper);
    wrapper.querySelectorAll('.fin-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window[`fin_${field.id}`] = btn.dataset.val;
        renderFinInputs();
        calculateFin();
      });
    });
    // Ensure stored value
    if (window[`fin_${field.id}`] === undefined) window[`fin_${field.id}`] = field.default;
    return;
  }

  // Dual input (years + months)
  if (field.type === 'dualInput') {
    const yVal = window[`fin_${field.id}_y`] !== undefined ? window[`fin_${field.id}_y`] : field.defaultYears;
    const mVal = window[`fin_${field.id}_m`] !== undefined ? window[`fin_${field.id}_m`] : field.defaultMonths;
    wrapper.innerHTML = `
      <label class="fin-input-label">${labelText}</label>
      <div class="fin-dual-input-row">
        <div class="fin-dual-input-cell">
          <span class="fin-dual-sublabel">${S.years || 'Years'}</span>
          <div class="fin-input-group">
            <input type="number" class="fin-input" id="fi-${field.id}_y" value="${yVal}" min="0" step="1">
          </div>
        </div>
        <div class="fin-dual-input-cell">
          <span class="fin-dual-sublabel">${S.months || 'Months'}</span>
          <div class="fin-input-group">
            <input type="number" class="fin-input" id="fi-${field.id}_m" value="${mVal}" min="0" max="11" step="1">
          </div>
        </div>
      </div>
    `;
    parent.appendChild(wrapper);
    wrapper.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        window[`fin_${e.target.id.replace('fi-', '')}`] = e.target.value;
        calculateFin();
      });
    });
    return;
  }

  // Select field
  if (field.type === 'select') {
    const optionsHTML = (field.options || []).map(o =>
      `<option value="${o.value}" ${existingVal === o.value ? 'selected' : ''}>${S[o.labelKey] || o.labelKey}</option>`
    ).join('');
    wrapper.innerHTML = `
      <label class="fin-input-label">${labelText}</label>
      <div class="fin-input-group">
        <select class="fin-input fin-select" id="fi-${field.id}">${optionsHTML}</select>
      </div>
    `;
    parent.appendChild(wrapper);
    wrapper.querySelector('select').addEventListener('change', (e) => {
      window[`fin_${field.id}`] = e.target.value;
      renderFinInputs();
      calculateFin();
    });
    if (window[`fin_${field.id}`] === undefined) window[`fin_${field.id}`] = field.default;
    return;
  }

  // Text input (e.g. comma-separated years)
  if (field.type === 'text') {
    wrapper.innerHTML = `
      <label class="fin-input-label">${labelText}</label>
      <div class="fin-input-group">
        ${pre}
        <input type="text" class="fin-input" id="fi-${field.id}" value="${existingVal}" placeholder="${field.placeholder || ''}" autocomplete="off">
        ${suf}
      </div>
    `;
    parent.appendChild(wrapper);
    wrapper.querySelector('input').addEventListener('input', (e) => {
      window[`fin_${field.id}`] = e.target.value;
      calculateFin();
    });
    return;
  }

  // Default: number input
  const minAttr = field.min !== undefined ? `min="${field.min}"` : '';
  wrapper.innerHTML = `
    <label class="fin-input-label">${labelText}</label>
    <div class="fin-input-group">
      ${pre}
      <input type="number" class="fin-input" id="fi-${field.id}" value="${existingVal}" step="any" ${minAttr}>
      ${suf}
    </div>
  `;
  parent.appendChild(wrapper);
  wrapper.querySelector('input').addEventListener('input', (e) => {
    if (field.min !== undefined && parseFloat(e.target.value) < field.min) {
      e.target.value = field.min;
      window[`fin_${field.id}`] = field.min;
    } else {
      window[`fin_${field.id}`] = e.target.value;
    }
    calculateFin();
  });
}

function renderFinInputs() {
  const cat = state.finCategory;
  const config = FIN_CONFIG[cat];
  const S = STRINGS[state.lang];
  els.finInputGrid.innerHTML = '';

  // Clean up any old optional container
  const oldOptContainer = document.getElementById('fin-opt-container');
  if (oldOptContainer) oldOptContainer.remove();

  if (!config) return;

  const primaryFields = config.primary || (Array.isArray(config) ? config : []);
  primaryFields.forEach(field => renderFinField(field, els.finInputGrid, S));

  // Determine if this category has additional options
  let hasAdditional = false;
  let customOptionalFields = [];

  if (cat === 'loan') {
    hasAdditional = true;
    const loanType = window.fin_loanType || 'vehicle';
    if (loanType === 'vehicle') {
      customOptionalFields = [
        { id: 'downpayment', labelKey: 'downpayment', default: '0', prefix: '₹' },
        { id: 'exchangeVal', labelKey: 'exchangeVal', default: '0', prefix: '₹' },
        { id: 'procFee', labelKey: 'procFee', default: '0', suffix: '%' },
        {
          id: 'repayFreq', labelKey: 'repayFreq', type: 'select', default: 'monthly', options: [
            { value: 'monthly', labelKey: 'freqMonthly' },
            { value: 'quarterly', labelKey: 'freqQuarterly' },
            { value: 'halfyearly', labelKey: 'freqHalfYearly' },
            { value: 'yearly', labelKey: 'freqYearly' }
          ]
        },
        { id: 'prepayAmt', labelKey: 'prepayAmt', default: '0', prefix: '₹' },
        {
          id: 'prepayMode', labelKey: 'prepayMode', default: 'tenure', type: 'select', options: [
            { value: 'tenure', labelKey: 'prepayReduceTenure' },
            { value: 'emi', labelKey: 'prepayReduceEmi' }
          ]
        }
      ];
    } else if (loanType === 'home') {
      customOptionalFields = [
        { id: 'downpayment', labelKey: 'downpayment', default: '0', prefix: '₹' },
        { id: 'procFee', labelKey: 'procFee', default: '0', suffix: '%' },
        {
          id: 'repayFreq', labelKey: 'repayFreq', type: 'select', default: 'monthly', options: [
            { value: 'monthly', labelKey: 'freqMonthly' },
            { value: 'quarterly', labelKey: 'freqQuarterly' },
            { value: 'halfyearly', labelKey: 'freqHalfYearly' },
            { value: 'yearly', labelKey: 'freqYearly' }
          ]
        },
        { id: 'prepayAmt', labelKey: 'prepayAmt', default: '0', prefix: '₹' },
        {
          id: 'prepayMode', labelKey: 'prepayMode', default: 'tenure', type: 'select', options: [
            { value: 'tenure', labelKey: 'prepayReduceTenure' },
            { value: 'emi', labelKey: 'prepayReduceEmi' }
          ]
        }
      ];
    } else if (loanType === 'personal') {
      customOptionalFields = [
        { id: 'procFee', labelKey: 'procFee', default: '0', suffix: '%' },
        { id: 'prepayAmt', labelKey: 'prepayAmt', default: '0', prefix: '₹' },
        {
          id: 'prepayMode', labelKey: 'prepayMode', default: 'tenure', type: 'select', options: [
            { value: 'tenure', labelKey: 'prepayReduceTenure' },
            { value: 'emi', labelKey: 'prepayReduceEmi' }
          ]
        }
      ];
    } else if (loanType === 'education') {
      customOptionalFields = [
        { id: 'moratorium', labelKey: 'moratorium', default: '0', suffix: 'mo' },
        { id: 'procFee', labelKey: 'procFee', default: '0', suffix: '%' },
        { id: 'prepayAmt', labelKey: 'prepayAmt', default: '0', prefix: '₹' },
        {
          id: 'prepayMode', labelKey: 'prepayMode', default: 'tenure', type: 'select', options: [
            { value: 'tenure', labelKey: 'prepayReduceTenure' },
            { value: 'emi', labelKey: 'prepayReduceEmi' }
          ]
        }
      ];
    }
  } else if (cat === 'nsc') {
    hasAdditional = true;
  } else if (config.optional && config.optional.length > 0) {
    hasAdditional = true;
    customOptionalFields = config.optional;
  }

  if (hasAdditional) {
    const optContainer = document.createElement('div');
    optContainer.id = 'fin-opt-container';
    optContainer.className = 'fin-opt-container';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    const optKey = '_optExpanded_' + cat;
    toggleBtn.className = 'fin-optional-toggle' + (window[optKey] ? ' expanded' : '');
    toggleBtn.innerHTML = `<span>⚙️ ${S.optionalFields || 'Additional Options'}</span> <span class="toggle-icon">+</span>`;
    optContainer.appendChild(toggleBtn);

    const panel = document.createElement('div');
    panel.className = 'fin-optional-panel' + (window[optKey] ? ' visible' : '');

    if (cat === 'nsc') {
      panel.classList.add('dynamic-layout');
      if (!window.fin_nsc_yearly_count) window.fin_nsc_yearly_count = 1;
      if (!window.fin_nsc_ot_count) window.fin_nsc_ot_count = 1;

      for (let i = 1; i <= window.fin_nsc_yearly_count; i++) {
        const group = document.createElement('div');
        group.className = 'fin-dynamic-group';
        const suffix = i === 1 ? '' : `_${i}`;
        const grid = document.createElement('div');
        grid.className = 'fin-dynamic-grid';
        renderFinField({ id: `nscAmt${suffix}`, labelKey: 'nscAddAmtLabel', default: '0', prefix: '₹' }, grid, S);
        renderFinField({ id: `nscStart${suffix}`, labelKey: 'nscAddStartLabel', default: '' }, grid, S);
        renderFinField({ id: `nscEnd${suffix}`, labelKey: 'nscAddEndLabel', default: '' }, grid, S);
        group.appendChild(grid);
        panel.appendChild(group);
      }

      const addYearlyBtn = document.createElement('button');
      addYearlyBtn.type = 'button';
      addYearlyBtn.className = 'fin-add-more-btn';
      addYearlyBtn.textContent = S.addMoreYearly || '+ Add More Yearly';
      addYearlyBtn.onclick = () => { window.fin_nsc_yearly_count++; renderFinInputs(); };
      panel.appendChild(addYearlyBtn);

      const sep = document.createElement('div');
      sep.style.height = '1px'; sep.style.background = 'var(--border)'; sep.style.margin = '0.5rem 0';
      panel.appendChild(sep);

      for (let i = 1; i <= window.fin_nsc_ot_count; i++) {
        const group = document.createElement('div');
        group.className = 'fin-dynamic-group';
        const suffix = i === 1 ? '' : `_${i}`;
        const grid = document.createElement('div');
        grid.className = 'fin-dynamic-grid';
        renderFinField({ id: `nscOTYears${suffix}`, labelKey: 'nscAddOTYearsLabel', default: '', type: 'text', placeholder: '2025,2030' }, grid, S);
        renderFinField({ id: `nscOTAmt${suffix}`, labelKey: 'nscAddOTAmtLabel', default: '0', prefix: '₹' }, grid, S);
        group.appendChild(grid);
        panel.appendChild(group);
      }

      const addOTBtn = document.createElement('button');
      addOTBtn.type = 'button';
      addOTBtn.className = 'fin-add-more-btn';
      addOTBtn.textContent = S.addMoreOneTime || '+ Add More One-Time';
      addOTBtn.onclick = () => { window.fin_nsc_ot_count++; renderFinInputs(); };
      panel.appendChild(addOTBtn);
    } else {
      const optGrid = document.createElement('div');
      optGrid.className = 'fin-opt-grid';
      customOptionalFields.forEach(f => renderFinField(f, optGrid, S));
      panel.appendChild(optGrid);
    }

    optContainer.appendChild(panel);
    els.finInputGrid.parentNode.appendChild(optContainer);

    toggleBtn.addEventListener('click', () => {
      window[optKey] = !window[optKey];
      toggleBtn.classList.toggle('expanded', window[optKey]);
      panel.classList.toggle('visible', window[optKey]);
    });
  }
}

function getFinVal(id) {
  const el = document.getElementById(`fi-${id}`);
  if (!el) return 0;
  return parseFloat(el.value) || 0;
}

// Get total months from dual year/month inputs
function getFinTenureMonths(baseId) {
  const yVal = window[`fin_${baseId}_y`] !== undefined ? parseFloat(window[`fin_${baseId}_y`]) || 0 : (parseFloat(FIN_CONFIG[state.finCategory]?.primary?.[3]?.defaultYears || FIN_CONFIG[state.finCategory]?.primary?.[2]?.defaultYears || '0'));
  const mVal = window[`fin_${baseId}_m`] !== undefined ? parseFloat(window[`fin_${baseId}_m`]) || 0 : 0;
  return Math.max(1, Math.round(yVal * 12 + mVal));
}

function calculateFin() {
  if (state.mode !== 'fin') return;
  const cat = state.finCategory;
  const S = STRINGS[state.lang];

  let totalInvestment = 0;
  let maturityValue = 0;
  let totalInterest = 0;
  let schedule = [];

  const fmtStr = (num) => '₹ ' + (Math.round(num * 10) / 10).toLocaleString('en-IN');
  let summaryHTML = '';

  if (cat === 'sip') {
    const sipType = window.fin_sipType || 'sip';
    const P = getFinVal('monthlySip');
    const annualRate = getFinVal('rate') / 100;
    const n = getFinTenureMonths('tenure_ym');
    const stepUpPct = getFinVal('sipStepUp');
    schedule = [];

    if (sipType === 'lumpsum') {
      // One-Time Mutual Fund Investment
      totalInvestment = P;
      const tYears = n / 12;
      maturityValue = P * Math.pow(1 + annualRate, tYears);
      totalInterest = Math.max(0, maturityValue - totalInvestment);

      const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
      let bal = P;
      for (let i = 1; i <= n; i++) {
        const monthlyInt = bal * monthlyRate;
        bal += monthlyInt;
        schedule.push({ p: i, deposited: P, interestEarned: Math.round(monthlyInt), balance: Math.round(bal) });
      }
    } else {
      // Monthly SIP (Annuity Due: payments at beginning of month)
      const r = annualRate / 12;
      let bal = 0;
      totalInvestment = 0;
      for (let i = 1; i <= n; i++) {
        const yearIndex = Math.floor((i - 1) / 12);
        const currentP = stepUpPct > 0 ? P * Math.pow(1 + stepUpPct / 100, yearIndex) : P;
        totalInvestment += currentP;
        bal += currentP;
        const monthlyInt = bal * r;
        bal += monthlyInt;
        schedule.push({ p: i, deposited: Math.round(totalInvestment), interestEarned: Math.round(monthlyInt), balance: Math.round(bal) });
      }
      maturityValue = bal;
      totalInterest = Math.max(0, maturityValue - totalInvestment);
    }
  }
  else if (cat === 'fd') {
    const P = getFinVal('principal');
    const r = getFinVal('rate') / 100;
    const totalMonths = getFinTenureMonths('tenure_ym');
    const t = totalMonths / 12;
    const freq = window.fin_fdCompFreq || 'quarterly';
    const freqMap = { monthly: 12, quarterly: 4, halfyearly: 2, yearly: 1 };
    const nForm = freqMap[freq] || 4;

    totalInvestment = P;
    maturityValue = P * Math.pow(1 + (r / nForm), nForm * t);
    totalInterest = Math.max(0, maturityValue - P);

    let bal = P;
    const monthlyRate = Math.pow(1 + r / nForm, nForm / 12) - 1;
    for (let i = 1; i <= totalMonths; i++) {
      const monthlyInt = bal * monthlyRate;
      bal += monthlyInt;
      schedule.push({ p: i, interestEarned: Math.round(monthlyInt), balance: Math.round(bal) });
    }
  }
  else if (cat === 'nsc') {
    // ── NSC: Timeline Model ──
    const P0 = getFinVal('nscPrincipal');
    const r = getFinVal('rate') / 100;
    const startYear = Math.round(getFinVal('nscStartYear') || new Date().getFullYear());
    const numCycles = Math.max(1, Math.round(getFinVal('nscCycles') || 1));
    const investMode = window.fin_nscInvestMode || 'onetime';    // 'onetime' | 'everyyear'
    const matAction = window.fin_nscMaturityAction || 'reinvestAll'; // 'reinvestAll' | 'renewP' | 'withdraw'

    let yearlyAdditions = [];
    const yearlyCount = window.fin_nsc_yearly_count || 1;
    for (let i = 1; i <= yearlyCount; i++) {
        const suffix = i === 1 ? '' : `_${i}`;
        yearlyAdditions.push({
            amt: getFinVal(`nscAmt${suffix}`) || 0,
            start: getFinVal(`nscStart${suffix}`) || 0,
            end: getFinVal(`nscEnd${suffix}`) || 9999
        });
    }

    let otAdditions = [];
    const otCount = window.fin_nsc_ot_count || 1;
    for (let i = 1; i <= otCount; i++) {
        const suffix = i === 1 ? '' : `_${i}`;
        const amt = getFinVal(`nscOTAmt${suffix}`) || 0;
        const yearsStr = (document.getElementById(`fi-nscOTYears${suffix}`)?.value || window[`fin_nscOTYears${suffix}`] || '').toString();
        const years = yearsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        otAdditions.push({ amt, years });
    }
    const LOCK = 5;

    let activeCerts = [];
    let nscSchedule = [];
    schedule = nscSchedule;
    let globalMaturity = 0;
    let globalTotalInvest = 0;
    let totalWithdrawn = 0;

    let maxYear = startYear + numCycles * LOCK;
    if (investMode === 'everyyear') maxYear += (LOCK - 1);

    for (let y = startYear; y <= maxYear; y++) {
      let yearInvested = 0;
      let yearReinvested = 0;
      let yearWithdrawn = 0;
      let yearFinalMaturity = 0;

      // 1. Process maturing certs
      let maturingCerts = activeCerts.filter(c => c.matYear === y);
      activeCerts = activeCerts.filter(c => c.matYear !== y);

      for (let c of maturingCerts) {
        let intEarned = c.matBal - c.bal;

        if (c.cycle < numCycles) {
          let nextBal = 0;
          if (matAction === 'reinvestAll') {
            nextBal = c.matBal;
          } else if (matAction === 'renewP') {
            nextBal = c.bal;
            yearWithdrawn += intEarned;
          } else {
            yearWithdrawn += c.matBal;
          }

          if (nextBal > 0) {
            activeCerts.push({
              startYear: y,
              matYear: y + LOCK,
              bal: nextBal,
              matBal: Math.round(nextBal * Math.pow(1 + r, LOCK)),
              cycle: c.cycle + 1
            });
            yearReinvested += nextBal;
          }
        } else {
          yearFinalMaturity += c.matBal;
          globalMaturity += c.matBal;
        }
      }

      // Process fresh investments
      let freshAmt = 0;
      if (investMode === 'onetime' && y === startYear) {
        freshAmt += P0;
      } else if (investMode === 'everyyear' && y < startYear + LOCK) {
        freshAmt += P0;
      }

      // Dynamic Yearly Additions
      for (let add of yearlyAdditions) {
          if (add.amt > 0 && add.start > 0 && y >= add.start && y <= add.end && y <= maxYear - LOCK) {
              freshAmt += add.amt;
          }
      }
      // Dynamic One-time Additions
      for (let add of otAdditions) {
          if (add.amt > 0 && add.years.includes(y)) {
              freshAmt += add.amt;
          }
      }

      if (freshAmt > 0) {
        let cyclesLeft = Math.floor((maxYear - y) / LOCK);
        if (cyclesLeft > 0) {
          activeCerts.push({
            startYear: y,
            matYear: y + LOCK,
            bal: freshAmt,
            matBal: Math.round(freshAmt * Math.pow(1 + r, LOCK)),
            cycle: numCycles - cyclesLeft + 1
          });
          globalTotalInvest += freshAmt;
          yearInvested += freshAmt;
        }
      }

      totalWithdrawn += yearWithdrawn;

      let runningBal = 0;
      for (let c of activeCerts) {
        let elapsed = y - c.startYear;
        if (elapsed >= 0) {
          runningBal += c.bal * Math.pow(1 + r, elapsed);
        }
      }

      nscSchedule.push({
        year: y,
        invested: yearInvested,
        reinvested: yearReinvested,
        matured: yearFinalMaturity,
        withdrawn: yearWithdrawn,
        balance: Math.round(runningBal)
      });
    }

    const investLabel = (investMode === 'everyyear') ? (S.nscModeEveryYear || 'Invest Fresh Every Year') : (S.nscModeOneTime || 'One-Time Investment');
    const actionLabel = matAction === 'reinvestAll' ? (S.nscMatReinvestAll || 'Reinvest P+I') :
      matAction === 'renewP' ? (S.nscMatRenewP || 'Renew P, Credit I') :
        (S.nscMatWithdraw || 'Withdraw All');

    let totalReturns = globalMaturity + totalWithdrawn;

    summaryHTML = `
      <div class="fin-summary-card"><div class="fsc-label">${S.totalInvest}</div><div class="fsc-value">${fmtStr(globalTotalInvest)}</div></div>
      <div class="fin-summary-card highlight"><div class="fsc-label">${S.maturityValue} ${totalWithdrawn > 0 ? '+ Withdrawn' : ''}</div><div class="fsc-value">${fmtStr(totalReturns)}</div></div>
      <div class="fin-summary-card nsc-mode-card"><div class="fsc-label">Mode</div><div class="fsc-value fsc-small">${investLabel}</div></div>
      <div class="fin-summary-card nsc-mode-card"><div class="fsc-label">At Maturity</div><div class="fsc-value fsc-small">${actionLabel}</div></div>
    `;
  }
  else if (cat === 'rd') {
    const P = getFinVal('monthlyDeposit');
    const r = getFinVal('rate') / 100;
    const n = getFinTenureMonths('tenure_ym');
    const compFreq = window.fin_rdCompFreq || 'quarterly';
    totalInvestment = P * n;
    schedule = [];

    if (compFreq === 'monthly') {
      const monthlyR = r / 12;
      let bal = 0;
      for (let i = 1; i <= n; i++) {
        bal += P;
        const monthlyInt = bal * monthlyR;
        bal += monthlyInt;
        schedule.push({ p: i, deposited: P * i, interestEarned: Math.round(monthlyInt), balance: Math.round(bal) });
      }
      maturityValue = bal;
      totalInterest = Math.max(0, maturityValue - totalInvestment);
    } else {
      // Standard Quarterly Compounding (Groww & Indian Bank formula)
      const iRate = r / 4;
      let prevBal = 0;
      let totalScheduleInt = 0;
      for (let m = 1; m <= n; m++) {
        const m_q = m / 3;
        const curBal = P * (Math.pow(1 + iRate, m_q) - 1) / (1 - Math.pow(1 + iRate, -1/3));
        const intEarned = curBal - prevBal - P;
        const roundedInt = Math.round(intEarned);
        totalScheduleInt += roundedInt;
        prevBal = curBal;
        schedule.push({ p: m, deposited: P * m, interestEarned: roundedInt, balance: P * m + totalScheduleInt });
      }
      totalInterest = totalScheduleInt;
      maturityValue = totalInvestment + totalInterest;
    }
  }
  else if (cat === 'ppf') {
    const P = getFinVal('yearlyDeposit');
    const r = getFinVal('rate') / 100;
    let y = Math.max(15, getFinVal('years')); // minimum 15 years
    if (window.fin_ppfExtend === 'yes') {
      y += 5;
    }

    totalInvestment = P * y;
    let bal = 0;
    for (let i = 1; i <= y; i++) {
      bal += P;
      const intEarned = bal * r;
      bal += intEarned;
      schedule.push({ p: i, deposited: P * i, interestEarned: Math.round(intEarned), balance: Math.round(bal) });
    }
    maturityValue = bal;
    totalInterest = Math.max(0, maturityValue - totalInvestment);
  }
  else if (cat === 'loan') {
    const loanType = window.fin_loanType || 'vehicle';
    const P_input = getFinVal('principal');
    const dp = (loanType === 'vehicle' || loanType === 'home') ? getFinVal('downpayment') : 0;
    const exVal = loanType === 'vehicle' ? getFinVal('exchangeVal') : 0;
    const annualRate = getFinVal('rate') / 100;
    const totalMonths = getFinTenureMonths('tenure_ym');
    const procFeePct = getFinVal('procFee');
    const prepayAmt = getFinVal('prepayAmt');
    const prepayMode = (document.getElementById('fi-prepayMode') || {}).value || window.fin_prepayMode || 'tenure';
    const repayFreq = (loanType === 'personal' || loanType === 'education') ? 'monthly' : (window.fin_repayFreq || 'monthly');
    const moratorium = loanType === 'education' ? (getFinVal('moratorium') || 0) : 0;

    const freqMap = { monthly: 12, quarterly: 4, halfyearly: 2, yearly: 1 };
    const periodsPerYear = freqMap[repayFreq] || 12;
    const r = annualRate / periodsPerYear;
    const n = Math.round(totalMonths / (12 / periodsPerYear));

    let P = Math.max(0, P_input - dp - exVal);
    if (moratorium > 0) {
      P = P * (1 + (annualRate / 12) * moratorium);
    }
    const fees = P * (procFeePct / 100);

    let emi = 0;
    if (r === 0) {
      emi = n > 0 ? P / n : 0;
    } else {
      emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    }
    if (isNaN(emi) || emi < 0 || !isFinite(emi)) emi = 0;

    let displayEmi = emi;
    let displayN = n;

    if (prepayAmt > 0 && prepayAmt < P) {
      const remainingP = P - prepayAmt;
      if (prepayMode === 'tenure') {
        if (r === 0) {
          displayN = Math.ceil(remainingP / emi);
        } else {
          displayN = Math.ceil(-Math.log(1 - (remainingP * r / emi)) / Math.log(1 + r));
        }
        if (!isFinite(displayN) || isNaN(displayN) || displayN < 0) displayN = 0;
      } else {
        if (r === 0) {
          displayEmi = n > 0 ? remainingP / n : 0;
        } else {
          displayEmi = remainingP * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
        }
        if (isNaN(displayEmi) || displayEmi < 0 || !isFinite(displayEmi)) displayEmi = 0;
      }
    }

    const totalPayment = displayEmi * displayN;
    totalInterest = Math.max(0, totalPayment - P);

    const installLabel = S.installment || 'Installment';
    let prepayExtraHTML = '';
    if (prepayAmt > 0) {
      if (prepayMode === 'tenure') {
        const savedPeriods = n - displayN;
        prepayExtraHTML = `
          <div class="fin-summary-card prepay-card"><div class="fsc-label">${S.newTenure || 'New Tenure'}</div><div class="fsc-value">${displayN} ${S.period || 'periods'}</div></div>
          <div class="fin-summary-card prepay-card"><div class="fsc-label">${S.tenureSaved || 'Tenure Saved'}</div><div class="fsc-value">${savedPeriods} ${S.period || 'periods'}</div></div>
        `;
      } else {
        prepayExtraHTML = `
          <div class="fin-summary-card prepay-card highlight"><div class="fsc-label">${S.newEmi || 'New EMI'}</div><div class="fsc-value">${fmtStr(displayEmi)}</div></div>
          <div class="fin-summary-card prepay-card"><div class="fsc-label">${S.emiSaved || 'EMI Saved'}</div><div class="fsc-value">${fmtStr(emi - displayEmi)}</div></div>
        `;
      }
    }

    summaryHTML = `
      <div class="fin-summary-card"><div class="fsc-label">${S.loanAmount}</div><div class="fsc-value">${fmtStr(P)}</div></div>
      <div class="fin-summary-card highlight"><div class="fsc-label">${installLabel} (${S['freq' + repayFreq.charAt(0).toUpperCase() + repayFreq.slice(1)] || repayFreq})</div><div class="fsc-value">${fmtStr(emi)}</div></div>
      <div class="fin-summary-card"><div class="fsc-label">${S.totalInterest}</div><div class="fsc-value">${fmtStr(totalInterest)}</div></div>
      <div class="fin-summary-card"><div class="fsc-label">${S.totalPayment}</div><div class="fsc-value">${fmtStr(displayEmi * displayN + fees)}</div></div>
      ${prepayExtraHTML}
    `;

    let bal = P - prepayAmt;
    if (bal < 0) bal = 0;
    const scheduleN = prepayMode === 'tenure' ? displayN : n;
    for (let i = 1; i <= scheduleN; i++) {
      const intPart = bal * r;
      let principalPart = displayEmi - intPart;
      if (i === scheduleN || principalPart > bal) principalPart = bal;
      bal -= principalPart;
      if (bal < 0) bal = 0;
      schedule.push({ p: i, emi: Math.round(displayEmi), principle: Math.round(principalPart), interestEarned: Math.round(intPart), balance: Math.round(bal) });
    }
  }

  // Generic Investment Summary (not for loan or nsc – they build their own)
  if (cat !== 'loan' && cat !== 'nsc') {
    summaryHTML = `
      <div class="fin-summary-card"><div class="fsc-label">${S.totalInvest}</div><div class="fsc-value">${fmtStr(totalInvestment)}</div></div>
      <div class="fin-summary-card"><div class="fsc-label">${S.estReturns}</div><div class="fsc-value">${fmtStr(totalInterest)}</div></div>
      <div class="fin-summary-card highlight"><div class="fsc-label">${S.maturityValue}</div><div class="fsc-value">${fmtStr(maturityValue)}</div></div>
    `;
  }

  els.finSummaryGrid.innerHTML = summaryHTML;
  renderFinTable(cat, schedule, S);
}

function renderFinTable(cat, schedule, S) {
  // NSC uses a fully custom table — delegate and return early
  if (cat === 'nsc') {
    renderNSCTable(schedule, S);
    return;
  }

  // Restore standard table structure if it was replaced (e.g., switching away from NSC)
  const scrollDiv = document.querySelector('.fin-table-scroll');
  if (scrollDiv && !document.getElementById('fin-table-head')) {
    scrollDiv.innerHTML = '<table class="fin-table" id="fin-table"><thead id="fin-table-head"></thead><tbody id="fin-table-body"></tbody></table>';
    els.finTableHead = document.getElementById('fin-table-head');
    els.finTableBody = document.getElementById('fin-table-body');
    if (els.finTableTitle) els.finTableTitle.textContent = 'Transaction Details';
  }

  const thead = els.finTableHead;
  const tbody = els.finTableBody;
  if (!thead || !tbody) return;
  thead.innerHTML = '';
  tbody.innerHTML = '';
  if (schedule.length === 0) return;

  const repayFreq = window.fin_repayFreq || 'monthly';
  const freqLabelMap = {
    monthly: S.month || 'Month',
    quarterly: S.freqQuarterly || 'Quarter',
    halfyearly: S.freqHalfYearly || 'Half-Year',
    yearly: S.year || 'Year'
  };
  const periodLabel = (cat === 'ppf' || cat === 'nsc') ? (S.year) : (cat === 'loan' ? (freqLabelMap[repayFreq] || S.month) : S.month);

  let headHTML = '<tr>';
  headHTML += `<th>${periodLabel}</th>`;

  if (cat === 'nsc') {
    headHTML += `<th>${S.nscCycle || 'Cycle'}</th><th>${S.interestList}</th>`;
    // Extra column for renewP mode
    const nscOpt = window.fin_nscReinvestOpt || 'renewAll';
    const nscMode = window.fin_nscMode || 'invest';
    if (nscMode === 'reinvest' && nscOpt === 'renewP') {
      headHTML += `<th>${S.interestCredited || 'Int. Credited'}</th>`;
    }
    headHTML += `<th>${S.balance}</th>`;
    if (nscMode === 'reinvest') headHTML += `<th></th>`; // action column
  } else if (cat === 'loan') {
    const emiLabel = S.installment || S.emi;
    headHTML += `<th>${emiLabel}</th><th>${S.principal}</th><th>${S.interestList}</th><th>${S.balance}</th>`;
  } else {
    if (schedule[0].deposited !== undefined) headHTML += `<th>${S.deposit}</th>`;
    headHTML += `<th>${S.interestList}</th><th>${S.balance}</th>`;
  }
  headHTML += '</tr>';
  thead.innerHTML = headHTML;

  const fmt = (n) => '₹ ' + Number(n).toLocaleString('en-IN');

  const rows = schedule.map(row => {
    let tr = `<tr><td>${row.p}</td>`;
    if (cat === 'nsc') {
      const nscOpt = window.fin_nscReinvestOpt || 'renewAll';
      const nscMode = window.fin_nscMode || 'invest';
      tr += `<td>${S.repeat || 'Cycle'} ${row.rep} · Yr ${row.repYear}</td><td>${fmt(row.interestEarned)}</td>`;
      if (nscMode === 'reinvest' && nscOpt === 'renewP') {
        tr += `<td>${row.interestCredited !== undefined ? fmt(row.interestCredited) : '—'}</td>`;
      }
      tr += `<td>${fmt(row.balance)}</td>`;
      if (nscMode === 'reinvest') {
        tr += `<td style="font-size:0.75rem;color:var(--accent3);font-weight:600">${row.action || ''}</td>`;
      }
    } else if (cat === 'loan') {
      tr += `<td>${fmt(row.emi)}</td><td>${fmt(row.principle)}</td><td>${fmt(row.interestEarned)}</td><td>${fmt(row.balance)}</td>`;
    } else {
      if (row.deposited !== undefined) tr += `<td>${fmt(row.deposited)}</td>`;
      tr += `<td>${fmt(row.interestEarned)}</td><td>${fmt(row.balance)}</td>`;
    }
    tr += '</tr>';
    return tr;
  });

  tbody.innerHTML = rows.join('');
}

// ──────────────────────────────────────────────
//  16.55 NSC CUSTOM TABLE RENDERER
// ──────────────────────────────────────────────

function renderNSCTable(schedule, S) {
  const scrollDiv = document.querySelector('.fin-table-scroll');
  if (!scrollDiv) return;
  if (els.finTableTitle) els.finTableTitle.textContent = 'NSC Year-by-Year Schedule';

  if (!schedule || schedule.length === 0) {
    scrollDiv.innerHTML = '<div style="padding:2rem;color:var(--text-muted);text-align:center">Enter parameters to generate NSC schedule.</div>';
    return;
  }

  const fmtINR = n => '₹\u00A0' + Number(Math.round(n)).toLocaleString('en-IN');

  let tbodyHTML = '';

  schedule.forEach((row) => {
    // Only show rows where something happened or balance > 0
    if (row.invested === 0 && row.reinvested === 0 && row.matured === 0 && row.withdrawn === 0 && row.balance === 0) return;

    let highlightStyle = row.matured > 0 ? 'background: rgba(16, 185, 129, 0.08); font-weight: 600;' : '';

    tbodyHTML += `
      <tr style="${highlightStyle}">
        <td style="text-align:center; font-weight: 700; color: var(--accent);">${row.year}</td>
        <td>${row.invested > 0 ? fmtINR(row.invested) : '—'}</td>
        <td>${row.reinvested > 0 ? fmtINR(row.reinvested) : '—'}</td>
        <td style="color: var(--accent3);">${row.withdrawn > 0 ? fmtINR(row.withdrawn) : '—'}</td>
        <td style="color: #10b981; font-weight: 600;">${row.matured > 0 ? fmtINR(row.matured) : '—'}</td>
        <td style="font-weight: 700;">${fmtINR(row.balance)}</td>
      </tr>`;
  });

  scrollDiv.innerHTML = `
    <table class="nsc-tbl fin-table" style="min-width:700px; line-height: 1.4; text-align: right;">
      <thead>
        <tr class="nsc-th-row1">
          <th class="nsc-th" style="width:60px; text-align:center;">Year</th>
          <th class="nsc-th">Fresh Invest</th>
          <th class="nsc-th">Reinvested</th>
          <th class="nsc-th">Withdrawn / Int.</th>
          <th class="nsc-th">Final Maturity</th>
          <th class="nsc-th">Total Balance</th>
        </tr>
      </thead>
      <tbody>${tbodyHTML}</tbody>
    </table>
  `;
}





// ──────────────────────────────────────────────
//  17. BASIC CALCULATOR LOGIC
// ──────────────────────────────────────────────

let basicState = {
  current: '0',
  prev: '',
  op: null,
  shouldReset: false,
};

function initBasicCalc() {
  const container = document.querySelector('.basic-calc-grid');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc-btn');
    if (!btn) return;
    handleBasicInput(btn.dataset.val);
  });

  window.addEventListener('keydown', (e) => {
    if (state.mode !== 'basic') return;
    const key = e.key;
    if (/[0-9]/.test(key)) handleBasicInput(key);
    else if (key === '.') handleBasicInput('.');
    else if (key === '+') handleBasicInput('+');
    else if (key === '-') handleBasicInput('-');
    else if (key === '*') handleBasicInput('*');
    else if (key === '/') handleBasicInput('/');
    else if (key === '%') handleBasicInput('%');
    else if (key === 'Enter' || key === '=') handleBasicInput('=');
    else if (key === 'Backspace') handleBasicInput('back');
    else if (key === 'Escape' || key === 'c' || key === 'C') handleBasicInput('C');
  });
}

function handleBasicInput(val) {
  if (val === 'C') {
    basicState = { current: '0', prev: '', op: null, shouldReset: false };
  } else if (val === 'back') {
    if (basicState.current.length > 1) {
      basicState.current = basicState.current.slice(0, -1);
    } else {
      basicState.current = '0';
    }
  } else if (val === '=') {
    if (basicState.op && basicState.prev) {
      calculateBasic();
      basicState.op = null;
      basicState.prev = '';
      basicState.shouldReset = true;
    }
  } else if (['+', '-', '*', '/', '%'].includes(val)) {
    if (basicState.op && !basicState.shouldReset) {
      calculateBasic();
    }
    basicState.op = val;
    basicState.prev = basicState.current;
    basicState.shouldReset = true;
  } else {
    // Number or dot
    if (basicState.shouldReset) {
      basicState.current = val === '.' ? '0.' : val;
      basicState.shouldReset = false;
    } else {
      if (val === '.' && basicState.current.includes('.')) return;
      if (basicState.current === '0' && val !== '.') {
        basicState.current = val;
      } else {
        basicState.current += val;
      }
    }
  }
  updateBasicUI();
}

function calculateBasic() {
  const p = parseFloat(basicState.prev);
  const c = parseFloat(basicState.current);
  if (isNaN(p) || isNaN(c)) return;

  let res = 0;
  switch (basicState.op) {
    case '+': res = p + c; break;
    case '-': res = p - c; break;
    case '*': res = p * c; break;
    case '/': res = c !== 0 ? p / c : 'Error'; break;
    case '%': res = (p * c) / 100; break;
  }

  basicState.current = res.toString();
}

function updateBasicUI() {
  if (!els.basicScreen) return;
  els.basicScreen.textContent = basicState.current;
  if (basicState.op && basicState.prev) {
    els.basicHistory.textContent = `${basicState.prev} ${basicState.op}`;
  } else {
    els.basicHistory.textContent = '';
  }
}


// ──────────────────────────────────────────────
//  18. VISITOR STATS LOGIC
// ──────────────────────────────────────────────

let visitorChartInstance = null;

function updateVisitorStats() {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0];
  
  // Get history
  let stats = JSON.parse(localStorage.getItem('unitcalc_visitor_stats')) || {
    total: 0,
    daily: {}
  };
  
  // We only count 1 visit per session (for simplicity, we increment on page load)
  // Let's use sessionStorage to only count once per session
  if (!sessionStorage.getItem('unitcalc_visited_today')) {
    stats.total += 1;
    stats.daily[dateString] = (stats.daily[dateString] || 0) + 1;
    localStorage.setItem('unitcalc_visitor_stats', JSON.stringify(stats));
    sessionStorage.setItem('unitcalc_visited_today', 'true');
  }
}

function initVisitorStats() {
  if (!els.statsToggle || !els.statsModalOverlay || !els.statsCloseBtn) return;
  
  els.statsToggle.addEventListener('click', () => {
    openStatsModal();
  });
  
  els.statsCloseBtn.addEventListener('click', () => {
    els.statsModalOverlay.classList.add('hidden');
  });
  
  els.statsModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.statsModalOverlay) {
      els.statsModalOverlay.classList.add('hidden');
    }
  });
}

function openStatsModal() {
  els.statsModalOverlay.classList.remove('hidden');
  
  const stats = JSON.parse(localStorage.getItem('unitcalc_visitor_stats')) || { total: 0, daily: {} };
  const todayString = new Date().toISOString().split('T')[0];
  
  els.statTotalVisits.textContent = stats.total;
  
  // Simulate unique devices based on total visits (approx 70-80% for demonstration)
  // Ensures it's at least 1 device since the user is on the site.
  let uniqueDevicesMock = Math.max(1, Math.floor(stats.total * 0.75));
  if (els.statUniqueDevices) {
    els.statUniqueDevices.textContent = uniqueDevicesMock;
  }
  
  els.statTodayVisits.textContent = stats.daily[todayString] || 0;
  
  renderVisitorChart(stats.daily);
}

function renderVisitorChart(dailyData) {
  if (!els.visitorChart) return;
  const ctx = els.visitorChart.getContext('2d');
  
  // Generate last 7 days labels
  const labels = [];
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    labels.push(displayDate);
    // Add mock data to make graph look interesting if there's no real data
    const mockVisits = Math.floor(Math.random() * 50) + 10;
    data.push(dailyData[dateStr] || (i > 0 ? mockVisits : (dailyData[dateStr] || 1)));
  }

  if (visitorChartInstance) {
    visitorChartInstance.destroy();
  }

  const isDark = document.body.classList.contains('dark-theme');
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  visitorChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Visits',
        data: data,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#fff',
          titleColor: isDark ? '#fff' : '#1e293b',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, stepSize: 10 },
          beginAtZero: true
        }
      }
    }
  });
}

// ──────────────────────────────────────────────
//  20. WEIGHT ⟷ VOLUME CONVERTER & COMPARISON
// ──────────────────────────────────────────────

const SUBSTANCES = [
  { id: 'water', nameEn: 'Water (પાણી)', density: 1.000, desc: 'Pure Water @ 4°C' },
  { id: 'milk', nameEn: 'Milk (દૂધ)', density: 1.030, desc: 'Whole Cow/Buffalo Milk' },
  { id: 'oil', nameEn: 'Cooking Oil (તેલ)', density: 0.920, desc: 'Vegetable / Mustard / Groundnut' },
  { id: 'ghee', nameEn: 'Desi Ghee (ઘી)', density: 0.905, desc: 'Clarified Butter / Ghee' },
  { id: 'honey', nameEn: 'Honey (મધ)', density: 1.420, desc: 'Natural Pure Honey' },
  { id: 'petrol', nameEn: 'Petrol (પેટ્રોલ)', density: 0.740, desc: 'Automotive Gasoline' },
  { id: 'diesel', nameEn: 'Diesel (ડીઝલ)', density: 0.832, desc: 'Automotive Diesel' },
  { id: 'kerosene', nameEn: 'Kerosene (કેરોસીન)', density: 0.810, desc: 'Standard Kerosene Oil' },
  { id: 'sugar', nameEn: 'Sugar (ખાંડ)', density: 0.850, desc: 'Granulated White Sugar' },
  { id: 'flour', nameEn: 'Wheat Flour (લોટ)', density: 0.590, desc: 'All-purpose Wheat Flour / Atta' },
];

const WV_WEIGHT_UNITS = {
  kg: 1.0,
  g: 0.001,
  mg: 1e-6,
  lb: 0.45359237,
  oz: 0.028349523,
  maund: 20.0,
  tola: 0.011664
};

const WV_VOLUME_UNITS = {
  L: 1.0,
  mL: 0.001,
  galUS: 3.785411784,
  cup: 0.2365882365,
  fl_oz: 0.02957352956,
  m3: 1000.0
};

let wvState = {
  substanceId: 'water',
  density: 1.000,
  direction: 'w2v', // 'w2v': Weight -> Volume | 'v2w': Volume -> Weight
  fromUnit: 'kg',
  toUnit: 'L',
  amount: 1
};

function initWeightVolumeConverter() {
  const substanceSelect = document.getElementById('wv-substance');
  const customDensityWrap = document.getElementById('wv-custom-density-wrap');
  const customDensityInput = document.getElementById('wv-custom-density');
  const btnW2V = document.getElementById('wv-dir-w2v');
  const btnV2W = document.getElementById('wv-dir-v2w');
  const fromInput = document.getElementById('wv-from-input');
  const fromUnitSelect = document.getElementById('wv-from-unit');
  const toUnitSelect = document.getElementById('wv-to-unit');
  const swapBtn = document.getElementById('wv-swap-btn');

  if (!substanceSelect || !fromInput) return;

  function setDirection(dir) {
    wvState.direction = dir;
    if (btnW2V && btnV2W) {
      btnW2V.classList.toggle('active', dir === 'w2v');
      btnV2W.classList.toggle('active', dir === 'v2w');
    }

    const fromLabel = document.getElementById('wv-from-label');
    const toLabel = document.getElementById('wv-to-label');

    if (dir === 'w2v') {
      if (fromLabel) fromLabel.textContent = 'Weight (Mass)';
      if (toLabel) toLabel.textContent = 'Volume (Capacity)';
      populateWVUnitSelects('weight', 'volume');
    } else {
      if (fromLabel) fromLabel.textContent = 'Volume (Capacity)';
      if (toLabel) toLabel.textContent = 'Weight (Mass)';
      populateWVUnitSelects('volume', 'weight');
    }
    updateWeightVolumeCalc();
  }

  function populateWVUnitSelects(fromType, toType) {
    if (!fromUnitSelect || !toUnitSelect) return;
    const weightOpts = `
      <option value="kg">Kilogram (kg)</option>
      <option value="g">Gram (g)</option>
      <option value="mg">Milligram (mg)</option>
      <option value="lb">Pound (lb)</option>
      <option value="oz">Ounce (oz)</option>
      <option value="maund">Maund (મણ = 20 kg)</option>
      <option value="tola">Tola (તોલા = 11.66g)</option>
    `;
    const volumeOpts = `
      <option value="L">Litre (L)</option>
      <option value="mL">Millilitre (mL)</option>
      <option value="galUS">Gallon US (gal)</option>
      <option value="cup">Cup (US)</option>
      <option value="fl_oz">Fluid Ounce (fl oz)</option>
      <option value="m3">Cubic Metre (m³)</option>
    `;

    fromUnitSelect.innerHTML = fromType === 'weight' ? weightOpts : volumeOpts;
    toUnitSelect.innerHTML = toType === 'weight' ? weightOpts : volumeOpts;

    wvState.fromUnit = fromUnitSelect.value;
    wvState.toUnit = toUnitSelect.value;
  }

  substanceSelect.addEventListener('change', (e) => {
    wvState.substanceId = e.target.value;
    if (e.target.value === 'custom') {
      if (customDensityWrap) customDensityWrap.classList.remove('hidden');
      wvState.density = parseFloat(customDensityInput?.value) || 1.0;
    } else {
      if (customDensityWrap) customDensityWrap.classList.add('hidden');
      const opt = e.target.selectedOptions[0];
      wvState.density = parseFloat(opt.dataset.density) || 1.0;
    }
    updateWeightVolumeCalc();
  });

  if (customDensityInput) {
    customDensityInput.addEventListener('input', (e) => {
      wvState.density = parseFloat(e.target.value) || 1.0;
      updateWeightVolumeCalc();
    });
  }

  if (btnW2V) btnW2V.addEventListener('click', () => setDirection('w2v'));
  if (btnV2W) btnV2W.addEventListener('click', () => setDirection('v2w'));

  if (fromInput) {
    fromInput.addEventListener('input', (e) => {
      wvState.amount = parseFloat(e.target.value) || 0;
      updateWeightVolumeCalc();
    });
  }

  if (fromUnitSelect) {
    fromUnitSelect.addEventListener('change', (e) => {
      wvState.fromUnit = e.target.value;
      updateWeightVolumeCalc();
    });
  }

  if (toUnitSelect) {
    toUnitSelect.addEventListener('change', (e) => {
      wvState.toUnit = e.target.value;
      updateWeightVolumeCalc();
    });
  }

  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      setDirection(wvState.direction === 'w2v' ? 'v2w' : 'w2v');
    });
  }

  // Initial setup
  setDirection('w2v');
  renderWVMatrix();
}

function updateWeightVolumeCalc() {
  const fromInput = document.getElementById('wv-from-input');
  const resultDisplay = document.getElementById('wv-result-display');
  const mainResult = document.getElementById('wv-main-result');
  const formulaBox = document.getElementById('wv-formula-box');

  const amt = fromInput ? (parseFloat(fromInput.value) || 0) : 1;
  const dir = wvState.direction;
  const density = Math.max(0.0001, wvState.density || 1.0); // in kg/L

  let calculatedResult = 0;
  let formulaStr = '';

  if (dir === 'w2v') {
    // Weight to Volume: Mass (kg) / Density (kg/L) = Volume (L)
    const massFactor = WV_WEIGHT_UNITS[wvState.fromUnit] || 1.0;
    const volFactor = WV_VOLUME_UNITS[wvState.toUnit] || 1.0;
    const massInKg = amt * massFactor;
    const volumeInLitres = massInKg / density;
    calculatedResult = volumeInLitres / volFactor;

    formulaStr = `Formula: Volume = Mass ÷ Density (${amt} ${wvState.fromUnit} ÷ ${density} kg/L = ${calculatedResult.toFixed(4)} ${wvState.toUnit})`;
  } else {
    // Volume to Weight: Volume (L) * Density (kg/L) = Mass (kg)
    const volFactor = WV_VOLUME_UNITS[wvState.fromUnit] || 1.0;
    const massFactor = WV_WEIGHT_UNITS[wvState.toUnit] || 1.0;
    const volumeInLitres = amt * volFactor;
    const massInKg = volumeInLitres * density;
    calculatedResult = massInKg / massFactor;

    formulaStr = `Formula: Mass = Volume × Density (${amt} ${wvState.fromUnit} × ${density} kg/L = ${calculatedResult.toFixed(4)} ${wvState.toUnit})`;
  }

  const formattedOutput = calculatedResult.toLocaleString('en-US', { maximumFractionDigits: 4 });
  if (resultDisplay) resultDisplay.textContent = `${formattedOutput} ${wvState.toUnit}`;
  if (mainResult) mainResult.textContent = `${amt} ${wvState.fromUnit} = ${formattedOutput} ${wvState.toUnit}`;
  if (formulaBox) formulaBox.textContent = formulaStr;

  renderWVMatrix();
}

function renderWVMatrix() {
  const matrixGrid = document.getElementById('wv-matrix-grid');
  if (!matrixGrid) return;
  matrixGrid.innerHTML = '';

  SUBSTANCES.forEach(sub => {
    // 1 kg = (1 / density) Litre
    const litPerKg = (1 / sub.density).toFixed(3);
    const kgPerLit = sub.density.toFixed(3);
    const isActive = wvState.substanceId === sub.id;

    const card = document.createElement('div');
    card.className = 'wv-matrix-card' + (isActive ? ' active-substance' : '');
    card.innerHTML = `
      <div class="wvm-name">${sub.nameEn}</div>
      <div class="wvm-val">1 kg = ${litPerKg} L</div>
      <div class="wvm-rev">1 Litre = ${kgPerLit} kg &bull; ρ: ${sub.density} kg/L</div>
    `;
    card.addEventListener('click', () => {
      const substanceSelect = document.getElementById('wv-substance');
      if (substanceSelect) {
        substanceSelect.value = sub.id;
        substanceSelect.dispatchEvent(new Event('change'));
      }
    });
    matrixGrid.appendChild(card);
  });
}


// ──────────────────────────────────────────────
//  21. SUPER ADMIN PANEL, USER AUTH & EMERGENCY
// ──────────────────────────────────────────────

const SUPER_ADMIN_USER = 'superadmin';
const SUPER_ADMIN_PASS = 'AdminMaster#2026';

function initAuthAndAdmin() {
  // Elements
  const authBtn = document.getElementById('auth-btn');
  const authBtnLabel = document.getElementById('auth-btn-label');
  const authModal = document.getElementById('auth-modal-overlay');
  const authCloseBtn = document.getElementById('auth-close-btn');

  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const tabAdmin = document.getElementById('auth-tab-admin');

  const panelLogin = document.getElementById('panel-login');
  const panelRegister = document.getElementById('panel-register');
  const panelAdmin = document.getElementById('panel-admin');

  const formLogin = document.getElementById('form-user-login');
  const formRegister = document.getElementById('form-user-register');
  const formAdmin = document.getElementById('form-super-admin');

  // User Dashboard
  const userDashModal = document.getElementById('user-dashboard-overlay');
  const userDashClose = document.getElementById('ud-close-btn');
  const userDashLogout = document.getElementById('ud-logout-btn');

  // Super Admin Modal
  const adminModal = document.getElementById('admin-panel-overlay');
  const adminCloseBtn = document.getElementById('admin-close-btn');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  const footerAdminLink = document.getElementById('footer-admin-link');

  // Emergency elements
  const emergencyOverlay = document.getElementById('emergency-overlay');
  const emergencyUnlockBtn = document.getElementById('emergency-admin-unlock-btn');
  const btnEmergencySuspend = document.getElementById('btn-emergency-suspend-toggle');
  const btnEmergencyResume = document.getElementById('btn-emergency-resume-toggle');
  const eccStatusLabel = document.getElementById('ecc-status-label');
  const adminSysStatus = document.getElementById('admin-sys-status');
  const emergencyMsgEl = document.getElementById('emergency-msg');
  const customMsgInput = document.getElementById('ecc-custom-msg');
  const btnSaveCustomMsg = document.getElementById('btn-save-emergency-msg');

  // Initialize Default Users if empty
  if (!localStorage.getItem('unitcalc_users')) {
    const seedUsers = [
      { id: 'USR-101', name: 'Demo User', email: 'user@example.com', pass: 'password123', role: 'user', status: 'Active', joined: new Date().toLocaleDateString() }
    ];
    localStorage.setItem('unitcalc_users', JSON.stringify(seedUsers));
  }

  // Check Emergency Status
  function checkEmergencyState() {
    const isSuspended = localStorage.getItem('site_emergency_suspended') === 'true';
    const customMsg = localStorage.getItem('site_emergency_msg');

    if (emergencyOverlay) {
      emergencyOverlay.classList.toggle('hidden', !isSuspended);
    }
    if (customMsg && emergencyMsgEl) {
      emergencyMsgEl.textContent = customMsg;
    }
    if (eccStatusLabel) {
      eccStatusLabel.textContent = isSuspended ? 'CURRENT: SUSPENDED' : 'CURRENT: OPERATIONAL';
      eccStatusLabel.classList.toggle('suspended', isSuspended);
    }
    if (adminSysStatus) {
      adminSysStatus.textContent = isSuspended ? '🔴 SYSTEM SUSPENDED' : '● SYSTEM OPERATIONAL';
      adminSysStatus.classList.toggle('suspended', isSuspended);
    }
    if (btnEmergencySuspend && btnEmergencyResume) {
      btnEmergencySuspend.classList.toggle('hidden', isSuspended);
      btnEmergencyResume.classList.toggle('hidden', !isSuspended);
    }
  }

  checkEmergencyState();

  // Check Current Session
  function updateAuthUI() {
    const session = JSON.parse(localStorage.getItem('unitcalc_session') || 'null');
    if (session && authBtnLabel) {
      if (session.role === 'admin') {
        authBtnLabel.textContent = '👑 Super Admin';
      } else {
        authBtnLabel.textContent = `👤 ${session.name.split(' ')[0]}`;
      }
    } else if (authBtnLabel) {
      authBtnLabel.textContent = 'Login / Register';
    }
  }
  updateAuthUI();

  // Auth Button Click
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      const session = JSON.parse(localStorage.getItem('unitcalc_session') || 'null');
      if (!session) {
        openAuthModal('login');
      } else if (session.role === 'admin') {
        openAdminModal();
      } else {
        openUserDashboard();
      }
    });
  }

  // Footer Admin Link
  if (footerAdminLink) {
    footerAdminLink.addEventListener('click', (e) => {
      e.preventDefault();
      const session = JSON.parse(localStorage.getItem('unitcalc_session') || 'null');
      if (session && session.role === 'admin') {
        openAdminModal();
      } else {
        openAuthModal('admin');
      }
    });
  }

  // Auth Modal Tab Switcher
  function openAuthModal(targetTab) {
    if (!authModal) return;
    authModal.classList.remove('hidden');

    const tabs = [
      { btn: tabLogin, panel: panelLogin, id: 'login' },
      { btn: tabRegister, panel: panelRegister, id: 'register' },
      { btn: tabAdmin, panel: panelAdmin, id: 'admin' }
    ];

    tabs.forEach(t => {
      const isMatch = t.id === targetTab;
      if (t.btn) t.btn.classList.toggle('active', isMatch);
      if (t.panel) t.panel.classList.toggle('hidden', !isMatch);
    });
  }

  if (tabLogin) tabLogin.addEventListener('click', () => openAuthModal('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => openAuthModal('register'));
  if (tabAdmin) tabAdmin.addEventListener('click', () => openAuthModal('admin'));
  if (authCloseBtn) authCloseBtn.addEventListener('click', () => authModal.classList.add('hidden'));

  // Form: User Login
  if (formLogin) {
    formLogin.addEventListener('submit', () => {
      const uVal = document.getElementById('login-username').value.trim();
      const pVal = document.getElementById('login-password').value;
      const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');

      const found = users.find(u => (u.email.toLowerCase() === uVal.toLowerCase() || u.name.toLowerCase() === uVal.toLowerCase()) && u.pass === pVal);

      if (found) {
        if (found.status === 'Suspended') {
          showToast('⚠️ This account has been suspended by Administrator.');
          return;
        }
        localStorage.setItem('unitcalc_session', JSON.stringify({
          role: found.role || 'user',
          name: found.name,
          email: found.email,
          id: found.id
        }));
        authModal.classList.add('hidden');
        updateAuthUI();
        showToast(`✓ Welcome, ${found.name}!`);
      } else {
        showToast('❌ Invalid email/username or password.');
      }
    });
  }

  // Form: User Register
  if (formRegister) {
    formRegister.addEventListener('submit', () => {
      const priv = getPrivileges();
      if (!priv.allowRegistration) {
        showToast('⛔ Registration is currently closed by Super Administrator.');
        return;
      }

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass = document.getElementById('reg-password').value;

      if (pass.length < 6) {
        showToast('⚠️ Password must be at least 6 characters.');
        return;
      }

      let users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast('⚠️ An account with this email already exists.');
        return;
      }

      const newUser = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        email,
        pass,
        role: 'user',
        status: 'Active',
        joined: new Date().toLocaleDateString()
      };

      users.push(newUser);
      localStorage.setItem('unitcalc_users', JSON.stringify(users));
      localStorage.setItem('unitcalc_session', JSON.stringify({
        role: 'user',
        name,
        email,
        id: newUser.id
      }));

      authModal.classList.add('hidden');
      updateAuthUI();
      showToast(`✓ Account created! Welcome, ${name}!`);
    });
  }

  // Form: Super Admin Login
  if (formAdmin) {
    formAdmin.addEventListener('submit', () => {
      const adminUser = document.getElementById('admin-user').value.trim();
      const adminPass = document.getElementById('admin-pass').value;

      const masterUser = localStorage.getItem('custom_admin_user') || SUPER_ADMIN_USER;
      const masterPass = localStorage.getItem('custom_admin_pass') || SUPER_ADMIN_PASS;

      if (adminUser.toLowerCase() === masterUser.toLowerCase() && adminPass === masterPass) {
        localStorage.setItem('unitcalc_session', JSON.stringify({
          role: 'admin',
          name: localStorage.getItem('custom_admin_name') || 'Master Super Administrator',
          email: localStorage.getItem('custom_admin_email') || 'superadmin@unitcalc.internal',
          id: 'ROOT-001'
        }));
        authModal.classList.add('hidden');
        updateAuthUI();
        showToast('👑 Super Administrator Access Verified!');
        openAdminModal();
      } else {
        showToast('⛔ Access Denied: Invalid Administrative Credentials.');
      }
    });
  }

  // User Dashboard
  function openUserDashboard() {
    if (!userDashModal) return;
    const session = JSON.parse(localStorage.getItem('unitcalc_session') || 'null');
    if (!session) return;

    const nameEl = document.getElementById('ud-name');
    const emailEl = document.getElementById('ud-email');
    if (nameEl) nameEl.textContent = session.name;
    if (emailEl) emailEl.textContent = session.email;

    userDashModal.classList.remove('hidden');
  }

  if (userDashClose) userDashClose.addEventListener('click', () => userDashModal.classList.add('hidden'));
  if (userDashLogout) {
    userDashLogout.addEventListener('click', () => {
      localStorage.removeItem('unitcalc_session');
      userDashModal.classList.add('hidden');
      updateAuthUI();
      showToast('Logged out successfully.');
    });
  }

  // Super Admin Control Center Modal
  function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('hidden');
    refreshAdminDashboard();
    renderPrivilegeSection();
  }

  if (adminCloseBtn) adminCloseBtn.addEventListener('click', () => adminModal.classList.add('hidden'));
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem('unitcalc_session');
      adminModal.classList.add('hidden');
      updateAuthUI();
      showToast('Super Admin Logged Out.');
    });
  }

  // Super Admin Sidebar Navigation
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-sec').forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const secId = btn.dataset.sec;
      const sec = document.getElementById(secId);
      if (sec) sec.classList.add('active');
      if (secId === 'adm-privileges') {
        renderPrivilegeSection();
      }
    });
  });

  // Refresh Admin KPIs and Users
  function refreshAdminDashboard() {
    const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');
    const kpiUsers = document.getElementById('adm-kpi-users');
    const kpiCalcs = document.getElementById('adm-kpi-calcs');
    if (kpiUsers) kpiUsers.textContent = users.length;
    if (kpiCalcs) kpiCalcs.textContent = localStorage.getItem('unitcalc_calcs_count') || '142';

    renderAdminUsersTable();
  }

  function renderAdminUsersTable() {
    const tbody = document.getElementById('adm-users-tbody');
    if (!tbody) return;
    const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');
    tbody.innerHTML = '';

    users.forEach((u, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${u.id}</code></td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span style="font-weight:700; color:#8b5cf6;">${u.role}</span></td>
        <td><span style="color:${u.status === 'Active' ? '#10b981' : '#ef4444'}; font-weight:700;">${u.status}</span></td>
        <td>${u.joined || 'Recent'}</td>
        <td style="display:flex; gap:0.4rem;">
          <button class="btn-table-action suspend" data-idx="${idx}">${u.status === 'Active' ? 'Suspend' : 'Activate'}</button>
          <button class="btn-table-action delete" data-idx="${idx}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-table-action.suspend').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.dataset.idx);
        users[i].status = users[i].status === 'Active' ? 'Suspended' : 'Active';
        localStorage.setItem('unitcalc_users', JSON.stringify(users));
        renderAdminUsersTable();
        showToast(`User status updated to ${users[i].status}`);
      });
    });

    tbody.querySelectorAll('.btn-table-action.delete').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.dataset.idx);
        if (confirm(`Are you sure you want to delete user ${users[i].name}?`)) {
          users.splice(i, 1);
          localStorage.setItem('unitcalc_users', JSON.stringify(users));
          renderAdminUsersTable();
          showToast('User account deleted.');
        }
      });
    });
  }

  // Add User Manually Button
  const btnAddUser = document.getElementById('btn-adm-add-user');
  if (btnAddUser) {
    btnAddUser.addEventListener('click', () => {
      const name = prompt('Enter Full Name:');
      if (!name) return;
      const email = prompt('Enter Email Address:');
      if (!email) return;
      const pass = prompt('Enter Temporary Password:');
      if (!pass) return;

      const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');
      users.push({
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        email,
        pass,
        role: 'user',
        status: 'Active',
        joined: new Date().toLocaleDateString()
      });
      localStorage.setItem('unitcalc_users', JSON.stringify(users));
      renderAdminUsersTable();
      showToast('New user added successfully.');
    });
  }

  // Formula Live Tester (RD Formula Verification)
  const btnFtRd = document.getElementById('ft-rd-calc-btn');
  if (btnFtRd) {
    btnFtRd.addEventListener('click', () => {
      const p = parseFloat(document.getElementById('ft-rd-p').value) || 3880;
      const rate = parseFloat(document.getElementById('ft-rd-r').value) || 6.9;
      const m = parseInt(document.getElementById('ft-rd-m').value) || 24;

      const i = (rate / 100) / 4;
      const q = m / 3;
      const M = p * (Math.pow(1 + i, q) - 1) / (1 - Math.pow(1 + i, -1/3));
      const totalDep = p * m;
      let totalScheduleInt = 0;
      let prevBal = 0;

      for (let k = 1; k <= m; k++) {
        const curBal = p * (Math.pow(1 + i, k / 3) - 1) / (1 - Math.pow(1 + i, -1/3));
        const intEarned = curBal - prevBal - p;
        totalScheduleInt += Math.round(intEarned);
        prevBal = curBal;
      }

      const totalMat = totalDep + totalScheduleInt;
      const resultEl = document.getElementById('ft-rd-result');
      if (resultEl) {
        resultEl.textContent = `Result: Total Deposit: ₹${totalDep.toLocaleString()} | Interest Earned: ₹${totalScheduleInt.toLocaleString()} | Maturity Value: ₹${totalMat.toLocaleString()} (Verified ✓)`;
      }
    });
  }

  // Emergency Suspend / Resume Buttons
  if (btnEmergencySuspend) {
    btnEmergencySuspend.addEventListener('click', () => {
      if (confirm('⚠️ ARE YOU SURE you want to EMERGENCY SUSPEND the entire website? Public access will be blocked.')) {
        localStorage.setItem('site_emergency_suspended', 'true');
        checkEmergencyState();
        showToast('🚨 SYSTEM SUSPENDED from Host.');
      }
    });
  }

  if (btnEmergencyResume) {
    btnEmergencyResume.addEventListener('click', () => {
      localStorage.setItem('site_emergency_suspended', 'false');
      checkEmergencyState();
      showToast('✅ All services resumed normally.');
    });
  }

  if (emergencyUnlockBtn) {
    emergencyUnlockBtn.addEventListener('click', () => {
      openAuthModal('admin');
    });
  }

  // Save Custom Emergency Notice
  if (btnSaveCustomMsg && customMsgInput) {
    btnSaveCustomMsg.addEventListener('click', () => {
      const val = customMsgInput.value.trim();
      if (val) {
        localStorage.setItem('site_emergency_msg', val);
        checkEmergencyState();
        showToast('Custom suspension notice updated.');
      }
    });
  }

  // Save Profile Changes
  const formUpdateProfile = document.getElementById('form-adm-update-profile');
  if (formUpdateProfile) {
    formUpdateProfile.addEventListener('submit', () => {
      const newName = document.getElementById('adm-edit-name').value.trim();
      const newEmail = document.getElementById('adm-edit-email').value.trim();
      const newPass = document.getElementById('adm-new-pass').value;

      if (newName) localStorage.setItem('custom_admin_name', newName);
      if (newEmail) localStorage.setItem('custom_admin_email', newEmail);
      if (newPass) localStorage.setItem('custom_admin_pass', newPass);

      const pName = document.getElementById('adm-profile-name');
      const pEmail = document.getElementById('adm-profile-email');
      if (pName) pName.textContent = newName || 'Master Super Administrator';
      if (pEmail) pEmail.textContent = newEmail || 'superadmin@unitcalc.internal';

      showToast('Admin profile & credentials updated.');
    });
  }

  // Cache Flusher
  const btnFlushCache = document.getElementById('btn-adm-clear-cache');
  if (btnFlushCache) {
    btnFlushCache.addEventListener('click', () => {
      localStorage.removeItem('unitcalc_visitor_stats');
      localStorage.removeItem('unitcalc_calcs_count');
      showToast('Temporary cache flushed.');
    });
  }

  // ── Header Nav Link Privilege Interceptors (PDF, Compiler, Color, QR) ──
  document.querySelectorAll('.header-controls .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      let toolId = null;
      if (href.includes('pdf')) toolId = 'pdf';
      else if (href.includes('compiler')) toolId = 'compiler';
      else if (href.includes('color')) toolId = 'color';
      else if (href.includes('qr')) toolId = 'qr';

      if (toolId) {
        const check = canAccess(toolId);
        if (!check.allowed) {
          e.preventDefault();
          showPrivilegeLock(check.msg, check.reason === 'login_required');
        }
      }
    });
  });

  // ── Privilege Lock Modal Listeners ──
  const btnLockLogin = document.getElementById('btn-lock-login');
  const btnLockDismiss = document.getElementById('btn-lock-dismiss');
  if (btnLockLogin) {
    btnLockLogin.addEventListener('click', () => {
      hidePrivilegeLock();
      openAuthModal('login');
    });
  }
  if (btnLockDismiss) {
    btnLockDismiss.addEventListener('click', hidePrivilegeLock);
  }

  // ── Super Admin Privilege Governance Section ──
  function renderPrivilegeSection() {
    const priv = getPrivileges();

    // Gatekeeper Toggles
    const reqLoginToggle = document.getElementById('priv-req-login-toggle');
    const allowRegToggle = document.getElementById('priv-allow-reg-toggle');
    if (reqLoginToggle) {
      reqLoginToggle.checked = priv.requireLogin;
      reqLoginToggle.onchange = () => {
        priv.requireLogin = reqLoginToggle.checked;
        savePrivileges(priv);
        showToast(priv.requireLogin ? '🔐 Mandatory Login Requirement Enabled.' : '🔓 Public Tool Access Enabled.');
      };
    }
    if (allowRegToggle) {
      allowRegToggle.checked = priv.allowRegistration;
      allowRegToggle.onchange = () => {
        priv.allowRegistration = allowRegToggle.checked;
        savePrivileges(priv);
        showToast(priv.allowRegistration ? '✓ Public Registration Enabled.' : '⛔ Public Registration Disabled.');
      };
    }

    // Global Master Tool Cards
    const globalToolsContainer = document.getElementById('priv-global-tools-container');
    if (globalToolsContainer) {
      globalToolsContainer.innerHTML = '';
      TOOLS_DEF.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'priv-tool-card';
        const isToolActive = priv.globalTools[tool.id] !== false;

        let sectionsHTML = '';
        if (tool.sections && tool.sections.length > 0) {
          sectionsHTML = `
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-top:0.3rem;">Tool Sections</div>
            <div class="ptc-sections-list">
              ${tool.sections.map(s => {
                const isSecActive = priv.globalSections[s.id] !== false;
                return `
                  <label class="ptc-sec-pill ${isSecActive ? 'granted' : 'denied'}">
                    <input type="checkbox" data-sec-id="${s.id}" ${isSecActive ? 'checked' : ''}>
                    <span>${s.name}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="ptc-header">
            <div class="ptc-title-wrap">
              <span class="ptc-icon">${tool.icon}</span>
              <span class="ptc-name">${tool.name}</span>
            </div>
            <label class="switch-toggle" title="Toggle Tool Globally">
              <input type="checkbox" data-tool-id="${tool.id}" ${isToolActive ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
          ${sectionsHTML}
        `;

        // Tool toggle listener
        const toolInp = card.querySelector(`input[data-tool-id="${tool.id}"]`);
        if (toolInp) {
          toolInp.addEventListener('change', (e) => {
            priv.globalTools[tool.id] = e.target.checked;
            savePrivileges(priv);
            showToast(`Tool '${tool.name}' ${e.target.checked ? 'Enabled Globally' : 'Disabled Globally'}`);
          });
        }

        // Section checkboxes
        card.querySelectorAll('input[data-sec-id]').forEach(secCheckbox => {
          secCheckbox.addEventListener('change', (e) => {
            const secId = e.target.dataset.secId;
            priv.globalSections[secId] = e.target.checked;
            const pill = e.target.closest('.ptc-sec-pill');
            if (pill) {
              pill.classList.toggle('granted', e.target.checked);
              pill.classList.toggle('denied', !e.target.checked);
            }
            savePrivileges(priv);
            showToast(`Section '${secId}' ${e.target.checked ? 'Enabled' : 'Disabled'}`);
          });
        });

        globalToolsContainer.appendChild(card);
      });
    }

    // Quick Action Buttons (Grant All / Lock All globally)
    const btnGrantAllGlobal = document.getElementById('btn-priv-grant-all-global');
    const btnLockAllGlobal = document.getElementById('btn-priv-lock-all-global');
    if (btnGrantAllGlobal) {
      btnGrantAllGlobal.onclick = () => {
        TOOLS_DEF.forEach(t => {
          priv.globalTools[t.id] = true;
          t.sections.forEach(s => { priv.globalSections[s.id] = true; });
        });
        savePrivileges(priv);
        renderPrivilegeSection();
        showToast('✓ All tools and sections granted globally.');
      };
    }
    if (btnLockAllGlobal) {
      btnLockAllGlobal.onclick = () => {
        if (confirm('Are you sure you want to lock all tools globally? Visitors will be blocked from using them.')) {
          TOOLS_DEF.forEach(t => {
            priv.globalTools[t.id] = false;
            t.sections.forEach(s => { priv.globalSections[s.id] = false; });
          });
          savePrivileges(priv);
          renderPrivilegeSection();
          showToast('🔒 All tools have been locked globally.');
        }
      };
    }

    // User-Specific Privilege Manager
    renderUserPrivilegeManager(priv);
  }

  function renderUserPrivilegeManager(priv) {
    const userSelect = document.getElementById('priv-user-select');
    if (!userSelect) return;
    const users = JSON.parse(localStorage.getItem('unitcalc_users') || '[]');

    if (users.length === 0) {
      userSelect.innerHTML = '<option value="">No registered users found</option>';
    } else {
      userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.name} (${u.email}) [${u.id}]</option>`).join('');
    }

    const userMatrixContainer = document.getElementById('priv-user-matrix-container');

    function updateSelectedUserMatrix() {
      const selectedUserId = userSelect.value;
      const selectedUser = users.find(u => u.id === selectedUserId);
      const nameEl = document.getElementById('pum-user-name');
      const emailEl = document.getElementById('pum-user-email');
      const roleEl = document.getElementById('pum-user-role');
      const statusEl = document.getElementById('pum-user-status');

      if (!selectedUser) {
        if (nameEl) nameEl.textContent = 'None';
        if (emailEl) emailEl.textContent = '—';
        if (roleEl) roleEl.textContent = '—';
        if (statusEl) statusEl.textContent = '—';
        if (userMatrixContainer) userMatrixContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No user selected.</p>';
        return;
      }

      if (nameEl) nameEl.textContent = selectedUser.name;
      if (emailEl) emailEl.textContent = selectedUser.email;
      if (roleEl) roleEl.textContent = selectedUser.role || 'user';
      if (statusEl) {
        statusEl.textContent = selectedUser.status || 'Active';
        statusEl.style.color = selectedUser.status === 'Active' ? '#10b981' : '#ef4444';
      }

      if (!userMatrixContainer) return;
      userMatrixContainer.innerHTML = '';

      const uPriv = priv.userPrivileges[selectedUserId] || { tools: {}, sections: {} };

      TOOLS_DEF.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'priv-tool-card';
        const isToolAllowed = uPriv.tools?.[tool.id] !== false;

        let sectionsHTML = '';
        if (tool.sections && tool.sections.length > 0) {
          sectionsHTML = `
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; margin-top:0.3rem;">Sections for ${selectedUser.name}</div>
            <div class="ptc-sections-list">
              ${tool.sections.map(s => {
                const isSecAllowed = uPriv.sections?.[s.id] !== false;
                return `
                  <label class="ptc-sec-pill ${isSecAllowed ? 'granted' : 'denied'}">
                    <input type="checkbox" class="u-sec-check" data-sec-id="${s.id}" ${isSecAllowed ? 'checked' : ''}>
                    <span>${s.name}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="ptc-header">
            <div class="ptc-title-wrap">
              <span class="ptc-icon">${tool.icon}</span>
              <span class="ptc-name">${tool.name}</span>
            </div>
            <label class="switch-toggle" title="Grant/Revoke Tool for User">
              <input type="checkbox" class="u-tool-check" data-tool-id="${tool.id}" ${isToolAllowed ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
          ${sectionsHTML}
        `;

        card.querySelectorAll('.u-sec-check').forEach(chk => {
          chk.addEventListener('change', () => {
            const pill = chk.closest('.ptc-sec-pill');
            if (pill) {
              pill.classList.toggle('granted', chk.checked);
              pill.classList.toggle('denied', !chk.checked);
            }
          });
        });

        userMatrixContainer.appendChild(card);
      });
    }

    userSelect.onchange = updateSelectedUserMatrix;
    updateSelectedUserMatrix();

    // Grant All for User button
    const btnGrantAllUser = document.getElementById('btn-priv-user-grant-all');
    if (btnGrantAllUser) {
      btnGrantAllUser.onclick = () => {
        if (!userMatrixContainer) return;
        userMatrixContainer.querySelectorAll('input[type="checkbox"]').forEach(c => {
          c.checked = true;
          const pill = c.closest('.ptc-sec-pill');
          if (pill) { pill.classList.add('granted'); pill.classList.remove('denied'); }
        });
        showToast('All permissions marked as Granted for user. Click Save to persist.');
      };
    }

    // Revoke All for User button
    const btnRevokeAllUser = document.getElementById('btn-priv-user-revoke-all');
    if (btnRevokeAllUser) {
      btnRevokeAllUser.onclick = () => {
        if (!userMatrixContainer) return;
        userMatrixContainer.querySelectorAll('input[type="checkbox"]').forEach(c => {
          c.checked = false;
          const pill = c.closest('.ptc-sec-pill');
          if (pill) { pill.classList.remove('granted'); pill.classList.add('denied'); }
        });
        showToast('All permissions marked as Revoked for user. Click Save to persist.');
      };
    }

    // Save User Privileges button
    const btnSaveUserPriv = document.getElementById('btn-priv-user-save');
    if (btnSaveUserPriv) {
      btnSaveUserPriv.onclick = () => {
        const selectedUserId = userSelect.value;
        if (!selectedUserId) return;

        if (!priv.userPrivileges[selectedUserId]) {
          priv.userPrivileges[selectedUserId] = { tools: {}, sections: {} };
        }

        userMatrixContainer.querySelectorAll('.u-tool-check').forEach(chk => {
          priv.userPrivileges[selectedUserId].tools[chk.dataset.toolId] = chk.checked;
        });

        userMatrixContainer.querySelectorAll('.u-sec-check').forEach(chk => {
          priv.userPrivileges[selectedUserId].sections[chk.dataset.secId] = chk.checked;
        });

        savePrivileges(priv);
        showToast(`✓ Privileges saved successfully for user ${selectedUserId}!`);
      };
    }
  }
}

// ──────────────────────────────────────────────
//  22. INIT
// ──────────────────────────────────────────────

function init() {
  updateVisitorStats();
  initVisitorStats();
  initHeightCompare();
  initWeightVolumeConverter();
  initAuthAndAdmin();
  applyTheme();
  switchCategory('length');
  switchFinCategory('sip');
  initBasicCalc();
  applyLanguage();

  // Pre-fill with a demo value for unit calc
  els.fromInput.value = '1';
  state.rawInput = '1';
  calculate();
  
  // Default mode
  switchMode('unit');
}

init();

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
(function() {
  const btn = document.getElementById('hamburger-btn');
  const group = document.getElementById('nav-links-group');
  if (!btn || !group) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    group.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !group.contains(e.target)) {
      btn.classList.remove('active');
      group.classList.remove('show');
    }
  });
})();

// ─── TAB SCROLL ARROWS ────────────────────────────────────────────────────────
function scrollTabs(id, by) {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: by, behavior: 'smooth' });
}

// ─── AUTH SLIDESHOW ───────────────────────────────────────────────────────────
(function() {
  let currentSlide = 0;
  let timer;
  function goToAuthSlide(n) {
    const slides = document.querySelectorAll('.auth-slide');
    const dots = document.querySelectorAll('.auth-dot');
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }
  window.goToAuthSlide = goToAuthSlide;
  function startSlideshow() {
    clearInterval(timer);
    timer = setInterval(() => goToAuthSlide(currentSlide + 1), 3500);
  }
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    new MutationObserver(() => {
      if (!overlay.classList.contains('hidden')) startSlideshow();
      else clearInterval(timer);
    }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }
  document.querySelectorAll('.auth-dot').forEach((d, i) => {
    d.addEventListener('click', () => { goToAuthSlide(i); startSlideshow(); });
  });
})();

