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
    finalAmount: 'Final Amount'
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
    finalAmount: 'અંતિમ રકમ'
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
  modeBillBtn: $('mode-bill-btn'),
  unitTabsWrapper: $('unit-tabs-wrapper'),
  finTabsWrapper: $('fin-tabs-wrapper'),
  billTabsWrapper: $('bill-tabs-wrapper'),
  unitCalcSection: $('unit-calc-section'),
  finCalcSection: $('fin-calc-section'),
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
  els.resultDisplay.textContent = isNaN(resultVal) ? '—' : formatNum(resultVal, category);

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
    els.fiValue.textContent = `${inFi}  →  ${outFi}`;

    // Show formatted sub-text under panels
    els.fromFormatted.textContent = `= ${metreToFeetInch(inMetres)}`;
    els.toFormatted.textContent = `= ${metreToFeetInch(outMetres)}`;
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
//  12. CATEGORY SWITCH
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
  state.category = cat;
  const def = CATEGORY_DEFAULTS[cat] || { from: UNITS[cat][0].key, to: UNITS[cat][1].key };
  state.fromKey = def.from;
  state.toKey = def.to;

  // Update tabs
  document.querySelectorAll('#tabs-container .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.category === cat);
  });

  populateSelects(cat);

  // Show/hide special badges
  const isLength = cat === 'length';
  const hasGuj = UNITS[cat].some(u => u.gujarati);
  if (els.feetBadge) els.feetBadge.classList.toggle('hidden', !isLength);
  if (els.gujaratiBadge) els.gujaratiBadge.classList.toggle('hidden', !hasGuj);
  if (els.hcToggleWrapper) els.hcToggleWrapper.classList.toggle('hidden', !isLength);
  if (!isLength && els.hcSection) els.hcSection.classList.add('hidden'); // Close section if open

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
  state.mode = newMode;
  const isUnit = newMode === 'unit';
  const isFin = newMode === 'fin';

  els.modeUnitBtn.classList.toggle('active', isUnit);
  els.modeFinBtn.classList.toggle('active', isFin);

  els.unitTabsWrapper.classList.toggle('hidden', !isUnit);
  els.unitCalcSection.classList.toggle('hidden', !isUnit);

  els.finTabsWrapper.classList.toggle('hidden', !isFin);
  els.finCalcSection.classList.toggle('hidden', !isFin);

  if (isUnit) {
    switchCategory(state.category);
  } else if (isFin) {
    switchFinCategory(state.finCategory);
  }
}

function switchFinCategory(cat) {
  state.finCategory = cat;
  document.querySelectorAll('#fin-tabs-container .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.fincat === cat);
  });
  renderFinInputs();
  calculateFin();
}

const FIN_CONFIG = {
  sip: [
    { id: 'monthlySip', labelKey: 'monthlySip', default: '5000', prefix: '₹' },
    { id: 'rate', labelKey: 'rate', default: '12', suffix: '%' },
    { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '10', defaultMonths: '0' }
  ],
  fd: [
    { id: 'principal', labelKey: 'principal', default: '100000', prefix: '₹' },
    { id: 'rate', labelKey: 'rate', default: '7.0', suffix: '%' },
    { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '5', defaultMonths: '0' }
  ],
  rd: [
    { id: 'monthlyDeposit', labelKey: 'monthlyDeposit', default: '5000', prefix: '₹' },
    { id: 'rate', labelKey: 'rate', default: '6.5', suffix: '%' },
    { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '5', defaultMonths: '0' }
  ],
  ppf: [
    { id: 'yearlyDeposit', labelKey: 'yearlyDeposit', default: '150000', prefix: '₹' },
    { id: 'rate', labelKey: 'rate', default: '7.1', suffix: '%' },
    { id: 'years', labelKey: 'ppfYears', default: '15', min: 15 },
    { id: 'ppfExtend', labelKey: 'ppfExtendLabel', type: 'toggle', default: 'no', options: [{ value: 'no', labelKey: 'no' }, { value: 'yes', labelKey: 'yes' }] }
  ],
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
    optional: [
      // These will be rendered dynamically in renderFinInputs for NSC
    ]
  },
  loan: {
    primary: [
      { id: 'principal', labelKey: 'principal', default: '500000', prefix: '₹' },
      { id: 'rate', labelKey: 'rate', default: '8.5', suffix: '%' },
      { id: 'tenure_ym', labelKey: 'tenure', type: 'dualInput', defaultYears: '5', defaultMonths: '0' }
    ],
    optional: [
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
    ]
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
      // Re-render if this is a dependency for other fields
      renderFinInputs();
      calculateFin();
    });
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

  // Categories with special primary/optional structure
  if (config.primary) {
    // Primary fields
    config.primary.forEach(field => renderFinField(field, els.finInputGrid, S));

    if (cat === 'nsc') {
      // Remove old optional container if exists
      let oldOptContainer = document.getElementById('fin-opt-container');
      if (oldOptContainer) oldOptContainer.remove();

      const optContainer = document.createElement('div');
      optContainer.id = 'fin-opt-container';
      optContainer.style.marginTop = '1.5rem';

      // Collapsible optional toggle
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      const optKey = '_optExpanded_' + cat;
      toggleBtn.className = 'fin-optional-toggle' + (window[optKey] ? ' expanded' : '');
      toggleBtn.innerHTML = `<span class="toggle-icon">+</span> ${S.optionalFields || 'Additional Options'}`;
      optContainer.appendChild(toggleBtn);

      // Optional panel
      const panel = document.createElement('div');
      panel.className = 'fin-optional-panel' + (window[optKey] ? ' visible' : '');
      panel.classList.add('dynamic-layout');
      
      // Dynamic fields for NSC
      if (!window.fin_nsc_yearly_count) window.fin_nsc_yearly_count = 1;
      if (!window.fin_nsc_ot_count) window.fin_nsc_ot_count = 1;

      // Yearly sections
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
      addYearlyBtn.className = 'fin-add-more-btn';
      addYearlyBtn.textContent = S.addMoreYearly;
      addYearlyBtn.onclick = () => { window.fin_nsc_yearly_count++; renderFinInputs(); };
      panel.appendChild(addYearlyBtn);

      const sep = document.createElement('div');
      sep.style.height = '1px'; sep.style.background = 'var(--border)'; sep.style.margin = '0.5rem 0';
      panel.appendChild(sep);

      // One-time sections
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

      optContainer.appendChild(panel);
      els.finSummaryGrid.parentNode.appendChild(optContainer);

      toggleBtn.addEventListener('click', () => {
        window[optKey] = !window[optKey];
        toggleBtn.classList.toggle('expanded', window[optKey]);
        panel.classList.toggle('visible', window[optKey]);
      });
    } else if (config.optional) {
        // For other categories like Loan, render optional fields directly
        config.optional.forEach(field => renderFinField(field, els.finInputGrid, S));
    }
    return;
  }

  // Normal array configs
  config.forEach(field => renderFinField(field, els.finInputGrid, S));
}

function getFinVal(id) {
  const el = document.getElementById(`fi-${id}`);
  if (!el) return 0;
  return parseFloat(el.value) || 0;
}

// Get total months from dual year/month inputs
function getFinTenureMonths(baseId) {
  const yVal = window[`fin_${baseId}_y`] !== undefined ? parseFloat(window[`fin_${baseId}_y`]) || 0 : (parseFloat(FIN_CONFIG[state.finCategory]?.primary?.[2]?.defaultYears || FIN_CONFIG[state.finCategory]?.[2]?.defaultYears || '0'));
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
    const P = getFinVal('monthlySip');
    const r = getFinVal('rate') / 100 / 12;
    const n = getFinTenureMonths('tenure_ym');

    totalInvestment = P * n;
    maturityValue = r === 0 ? totalInvestment : P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    totalInterest = Math.max(0, maturityValue - totalInvestment);

    let bal = 0;
    for (let i = 1; i <= n; i++) {
      const intEarned = bal * r;
      bal += P + intEarned;
      schedule.push({ p: i, deposited: P * i, interestEarned: Math.round(intEarned), balance: Math.round(bal) });
    }
  }
  else if (cat === 'fd') {
    const P = getFinVal('principal');
    const r = getFinVal('rate') / 100;
    const totalMonths = getFinTenureMonths('tenure_ym');
    const t = totalMonths / 12;
    const nForm = 4; // quarterly compounding for FD

    totalInvestment = P;
    maturityValue = P * Math.pow(1 + (r / nForm), nForm * t);
    totalInterest = Math.max(0, maturityValue - P);

    let bal = P;
    for (let i = 1; i <= totalMonths; i++) {
      const monthlyInt = (bal * (Math.pow(1 + r / nForm, nForm / 12) - 1));
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
    // Additional Investments parsing
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
    totalInvestment = P * n;
    let bal = 0;
    for (let i = 1; i <= n; i++) {
      const effInt = Math.pow(1 + r / 4, 4 / 12) - 1;
      const monthlyInt = bal * effInt;
      bal += P + monthlyInt;
      schedule.push({ p: i, deposited: P * i, interestEarned: Math.round(monthlyInt), balance: Math.round(bal) });
    }
    maturityValue = bal;
    totalInterest = Math.max(0, maturityValue - totalInvestment);
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
    const P_input = getFinVal('principal');
    const dp = getFinVal('downpayment');
    const exVal = getFinVal('exchangeVal');
    const annualRate = getFinVal('rate') / 100;
    const totalMonths = getFinTenureMonths('tenure_ym');
    const procFeePct = getFinVal('procFee');
    const prepayAmt = getFinVal('prepayAmt');
    const prepayMode = (document.getElementById('fi-prepayMode') || {}).value || 'tenure';
    const repayFreq = window.fin_repayFreq || 'monthly';

    // Periods per year based on frequency
    const freqMap = { monthly: 12, quarterly: 4, halfyearly: 2, yearly: 1 };
    const periodsPerYear = freqMap[repayFreq] || 12;
    const r = annualRate / periodsPerYear; // rate per period
    const n = Math.round(totalMonths / (12 / periodsPerYear)); // total periods

    const P = Math.max(0, P_input - dp - exVal);
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

    // Prepayment logic
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

    // Installment label based on frequency
    const installLabel = S.installment || 'Installment';

    // Prepayment summary extras
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

    // Build schedule
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
//  17. INIT
// ──────────────────────────────────────────────

function init() {
  initHeightCompare();
  applyTheme();
  switchCategory('length');
  switchFinCategory('sip');
  applyLanguage();

  // Pre-fill with a demo value
  els.fromInput.value = '1';
  state.rawInput = '1';
  calculate();
}

init();
