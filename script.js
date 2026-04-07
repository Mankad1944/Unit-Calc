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
    { key: 'KB', labelEn: 'Kilobyte (KB)', labelGu: 'કિ.બા (KB)', toBase: v => v * 8000, fromBase: v => v / 8000 },
    { key: 'KiB', labelEn: 'Kibibyte (KiB)', labelGu: 'કિ.બ (KiB)', toBase: v => v * 8192, fromBase: v => v / 8192 },
    { key: 'MB', labelEn: 'Megabyte (MB)', labelGu: 'મે.બા (MB)', toBase: v => v * 8e6, fromBase: v => v / 8e6 },
    { key: 'MiB', labelEn: 'Mebibyte (MiB)', labelGu: 'મે.બ (MiB)', toBase: v => v * 8388608, fromBase: v => v / 8388608 },
    { key: 'GB', labelEn: 'Gigabyte (GB)', labelGu: 'ગી.બા (GB)', toBase: v => v * 8e9, fromBase: v => v / 8e9 },
    { key: 'GiB', labelEn: 'Gibibyte (GiB)', labelGu: 'ગી.બ (GiB)', toBase: v => v * 8589934592, fromBase: v => v / 8589934592 },
    { key: 'TB', labelEn: 'Terabyte (TB)', labelGu: 'ટે.બา (TB)', toBase: v => v * 8e12, fromBase: v => v / 8e12 },
    { key: 'TiB', labelEn: 'Tebibyte (TiB)', labelGu: 'ટે.બ (TiB)', toBase: v => v * 8796093022208, fromBase: v => v / 8796093022208 },
    { key: 'Pb', labelEn: 'Petabyte (PB)', labelGu: 'પે.બ (PB)', toBase: v => v * 8e15, fromBase: v => v / 8e15 },
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
  },
};

// ──────────────────────────────────────────────
//  3. STATE
// ──────────────────────────────────────────────
let state = {
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
  document.querySelectorAll('.tab-label').forEach(el => {
    const cat = el.getAttribute(`data-${lang}`);
    if (cat) el.textContent = cat;
  });

  // Badges
  els.badgeText.textContent = S.feetBadge;
  els.gujBadgeText.textContent = S.gujBadge;

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

  // Repopulate selects with translated labels
  populateSelects(state.category);
  calculate();
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
  document.querySelectorAll('.tab').forEach(t => {
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
}


// ──────────────────────────────────────────────
//  17. INIT
// ──────────────────────────────────────────────

function init() {
  initHeightCompare();
  applyTheme();
  switchCategory('length');
  applyLanguage();

  // Pre-fill with a demo value
  els.fromInput.value = '1';
  state.rawInput = '1';
  calculate();
}

init();
