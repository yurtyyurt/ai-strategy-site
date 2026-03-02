import type { PortfolioConfig, ExitRule, FcScenario } from './types';

// ── TAB NAMES ──
export const TABS = ['Universe', 'Backtests', 'Scenarios', 'My Portfolio', 'Model Portfolios', 'Exit Rules', '10-Year Forecast'];

// ── UNIVERSE DATA ──
// [ticker, category, annReturn, annVol, maxDD, sharpe]
export const UNIVERSE: [string, string, number, number, number, number][] = [
  ['NVDA','AI Leader',71.1,45.7,-66.0,1.56],
  ['PLTR','AI Broader',64.6,72.4,-82.1,0.89],
  ['AMD','AI Leader',55.7,56.6,-64.0,0.98],
  ['AVGO','AI Leader',36.1,37.2,-40.7,0.97],
  ['ARM','AI Newer',35.1,73.7,-51.6,0.48],
  ['ASML','AI Broader',31.2,35.7,-56.4,0.87],
  ['SMH','ETF',31.4,28.7,-44.5,1.09],
  ['TSM','AI Leader',31.2,30.3,-55.9,1.03],
  ['SOXX','ETF',28.1,29.0,-44.9,0.97],
  ['SMCI','AI Broader',25.8,71.2,-83.7,0.36],
  ['MRVL','AI Broader',23.6,45.6,-60.4,0.52],
  ['GOOGL','AI Leader',23.9,27.4,-41.9,0.87],
  ['MSFT','AI Leader',22.4,22.9,-35.5,0.97],
  ['AMZN','AI Leader',21.9,29.8,-54.8,0.74],
  ['QQQ','ETF',19.1,20.0,-35.5,0.95],
  ['META','AI Leader',19.5,35.7,-76.0,0.55],
  ['SPY','Benchmark',13.1,17.0,-32.2,0.77],
  ['CRM','AI Broader',10.6,33.8,-58.3,0.31],
  ['SNOW','AI Newer',-6.3,55.0,-72.3,-0.11],
];

// ── BACKTESTS DATA ──
// [strategy, totalReturn, annReturn, annVol, maxDD, sharpe, worst1Y]
export const BACKTESTS: [string, number, number, number, number, number, number][] = [
  ['Momentum AI (Top 3)',1628,32.9,27.0,-39.4,1.22,-36.9],
  ['AI Overweight (60/40)',1083,28.0,21.6,-39.1,1.29,-36.6],
  ['QQQ Benchmark',470,19.0,20.0,-35.5,0.95,-33.6],
  ['Market+AI Overlay (80/20)',462,18.8,18.3,-31.3,1.03,-25.6],
  ['SPY Benchmark',238,12.9,17.0,-32.2,0.76,-19.8],
];

// ── SCENARIOS DATA ──
export const SCENARIOS: Record<string, { label: string; prob: number; desc: string }> = {
  supercycle: { label: 'AI Supercycle', prob: 30, desc: 'AI leaders 20%/yr, market 7%/yr' },
  normalisation: { label: 'AI Normalisation', prob: 45, desc: 'AI leaders 12%/yr, market 8%/yr' },
  disappointment: { label: 'AI Disappointment', prob: 25, desc: 'AI leaders 3%/yr, market 6%/yr' },
};
export const ALLOCS = ['70/30', '50/50', '30/70'];
export const OUTCOMES: Record<string, Record<number, [number, number, number]>> = {
  supercycle: { 0: [4407, 1694, 11686], 1: [3702, 1637, 8701], 2: [3051, 1463, 6261] },
  normalisation: { 0: [2888, 1269, 6573], 1: [2792, 1351, 5761], 2: [2652, 1388, 5024] },
  disappointment: { 0: [1202, 383, 3760], 1: [1438, 547, 3631], 2: [1587, 693, 3750] },
};

// ── MODEL PORTFOLIOS ──
export const PORTFOLIOS: Record<string, {
  label: string; pct: number; recommended?: boolean;
  ai: [string, number, number][]; core: [string, number, number][];
}> = {
  conservative: {
    label: 'Conservative AI', pct: 20,
    ai: [['SMH', 8, 96], ['QQQ', 7, 84], ['NVDA', 3, 36], ['MSFT', 2, 24]],
    core: [['SPY/VWRL', 45, 540], ['Bonds', 20, 240], ['Gold', 8, 96], ['Cash', 7, 84]],
  },
  balanced: {
    label: 'Balanced AI', pct: 35, recommended: true,
    ai: [['NVDA', 7, 84], ['MSFT', 5, 60], ['SMH', 5, 60], ['GOOGL', 4, 48], ['AVGO', 4, 48], ['TSM', 3, 36], ['AMD', 3, 36], ['META', 2, 24], ['AMZN', 2, 24]],
    core: [['SPY/VWRL', 35, 420], ['Bonds', 15, 180], ['Gold', 5, 60], ['Cash', 5, 60], ['Commodities', 5, 60]],
  },
  aggressive: {
    label: 'Aggressive AI', pct: 50,
    ai: [['NVDA', 10, 120], ['MSFT', 6, 72], ['GOOGL', 5, 60], ['AVGO', 5, 60], ['TSM', 5, 60], ['AMD', 5, 60], ['META', 4, 48], ['AMZN', 3, 36], ['SMCI', 2, 24], ['PLTR', 2, 24], ['MRVL', 2, 24], ['ASML', 1, 12]],
    core: [['SPY/VWRL', 28, 336], ['Bonds', 10, 120], ['Gold', 5, 60], ['Cash', 4, 48], ['Commodities', 3, 36]],
  },
};

// ── MY PORTFOLIO ISSUES & RECS ──
export const MP_ISSUES = [
  { sev: 'high' as const, title: 'Extreme AI Concentration', desc: '84% in AI. If AI spending slows, nearly everything draws down.' },
  { sev: 'high' as const, title: 'Zero Diversification Outside Tech/AI', desc: 'No healthcare, financials, consumer staples, or real estate.' },
  { sev: 'high' as const, title: 'TSLA Valuation Extreme', desc: 'P/E 241x with declining revenue and earnings.' },
  { sev: 'medium' as const, title: 'Speculative Names Without Earnings', desc: 'CRWV + APLD + IREN + INTC = 8% combined.' },
  { sev: 'medium' as const, title: 'PLTR Valuation Rich', desc: 'P/E 218x, great growth but perfection priced in.' },
];
export const MP_RECS = [
  { icon: 'trim', title: 'TRIM TSLA', desc: 'Trim from ~6% to 2–3%. P/E 241x with declining revenue.' },
  { icon: 'trim', title: 'TRIM PLTR', desc: 'Trim from ~6% to 4%. P/E 218x leaves no margin of safety.' },
  { icon: 'exit', title: 'EXIT INTC', desc: 'Persistent losses, negative FCF, shrinking market share.' },
  { icon: 'exit', title: 'REDUCE APLD', desc: 'Deepening losses, negative OCF, dilution risk.' },
  { icon: 'hold', title: 'HOLD/ADD NVDA', desc: 'Core position well-sized. 88% rev CAGR, 60% margins.' },
  { icon: 'hold', title: 'HOLD MSFT', desc: 'Blue chip. 15% growth, 46% margins, $71B FCF.' },
  { icon: 'add', title: 'ADD ASML', desc: 'Only 2.3% — monopoly EUV supplier, add to 4–5%.' },
  { icon: 'add', title: 'ADD ANET', desc: 'Excellent quality, zero debt. Could add to 7–8%.' },
  { icon: 'add', title: 'ADD NEW', desc: 'Diversifiers — UNH/LLY for healthcare, V/JPM for financials, COST/PG for staples.' },
];

// ── EXIT RULES ──
export const EXIT_RULES: ExitRule[] = [
  { priority: 'high', name: 'Single-Name Cap', trigger: 'Any AI name >15% of NW', action: 'Trim to 10–12%' },
  { priority: 'high', name: 'AI Sleeve Max', trigger: 'Total AI >55%', action: 'Rebalance quarterly' },
  { priority: 'high', name: 'Drawdown Breaker', trigger: 'Portfolio DD >25% AND AI >60% of loss', action: 'Rotate 10–15% to cash' },
  { priority: 'high', name: 'Downside Alert', trigger: 'Simulated P10 <£1.2M', action: 'Reduce AI by 10%' },
  { priority: 'high', name: 'Base Protection', trigger: 'Always', action: 'Keep 40% minimum in boring assets (bonds/index/gold/cash)' },
  { priority: 'medium', name: 'Outperformance Check', trigger: 'AI 3Y return >2.5× SPY 3Y', action: 'Reduce 5%/quarter' },
  { priority: 'medium', name: 'Valuation Guard', trigger: 'Avg AI P/E >50×', action: 'Trim 2–3%/quarter' },
  { priority: 'medium', name: 'Annual Review', trigger: 'Every January', action: 'Rerun model, reassess scenarios' },
];

// ── 10-YEAR FORECAST DATA ──
export const FC_DATA: Record<string, FcScenario> = {
  bull: {
    label: 'Bull Case', prob: 25, desc: 'AI supercycle, crypto adoption, strong global growth',
    yearly: [
      { y: 0, med: 1350000, p10: 1350000, p90: 1350000 }, { y: 1, med: 1523288, p10: 1370014, p90: 1732076 },
      { y: 2, med: 1726684, p10: 1473347, p90: 2122310 }, { y: 3, med: 1962850, p10: 1597641, p90: 2617968 },
      { y: 4, med: 2244826, p10: 1753599, p90: 3221856 }, { y: 5, med: 2573618, p10: 1929045, p90: 4025822 },
      { y: 6, med: 2954603, p10: 2120402, p90: 5032401 }, { y: 7, med: 3399380, p10: 2341187, p90: 6324292 },
      { y: 8, med: 3974382, p10: 2583096, p90: 8028961 }, { y: 9, med: 4608354, p10: 2858291, p90: 10276736 },
      { y: 10, med: 5414676, p10: 3188759, p90: 13389341 },
    ],
    assets: [
      { name: 'AI/Tech Stocks', start: 324000, med: 1122735, p10: 461756, p90: 2834741, cagr: 13.2, color: '#3b82f6' },
      { name: 'Non-AI Stocks', start: 135000, med: 276792, p10: 172714, p90: 442474, cagr: 7.4, color: '#60a5fa' },
      { name: "Int'l Stocks", start: 54000, med: 105685, p10: 64071, p90: 171505, cagr: 6.9, color: '#93c5fd' },
      { name: 'Cyprus Land', start: 337000, med: 815789, p10: 568048, p90: 1184067, cagr: 9.2, color: '#22c55e' },
      { name: 'Bonds', start: 162000, med: 240363, p10: 175802, p90: 325932, cagr: 4.0, color: '#a3a3a3' },
      { name: 'Bitcoin', start: 94500, med: 698282, p10: 97414, p90: 5395137, cagr: 22.2, color: '#f59e0b' },
      { name: 'Gold', start: 67500, med: 195571, p10: 108102, p90: 363367, cagr: 11.2, color: '#eab308' },
      { name: 'Watches', start: 67500, med: 131652, p10: 95427, p90: 183447, cagr: 6.9, color: '#8b5cf6' },
      { name: 'Cash', start: 108000, med: 158832, p10: 146629, p90: 172093, cagr: 3.9, color: '#6b7280' },
    ],
    final: { p10: 3188759, med: 5414676, mean: 7741802, p90: 13389341 },
  },
  base: {
    label: 'Base Case', prob: 50, desc: 'AI normalises, markets at historical averages, moderate inflation',
    yearly: [
      { y: 0, med: 1350000, p10: 1350000, p90: 1350000 }, { y: 1, med: 1453081, p10: 1325405, p90: 1610503 },
      { y: 2, med: 1566762, p10: 1378286, p90: 1826801 }, { y: 3, med: 1689185, p10: 1443019, p90: 2056017 },
      { y: 4, med: 1822258, p10: 1514004, p90: 2327420 }, { y: 5, med: 1962078, p10: 1598359, p90: 2603658 },
      { y: 6, med: 2109288, p10: 1684631, p90: 2934491 }, { y: 7, med: 2275994, p10: 1782136, p90: 3302275 },
      { y: 8, med: 2463515, p10: 1882635, p90: 3697602 }, { y: 9, med: 2646056, p10: 1993856, p90: 4155024 },
      { y: 10, med: 2847825, p10: 2113661, p90: 4649146 },
    ],
    assets: [
      { name: 'AI/Tech Stocks', start: 324000, med: 772693, p10: 371843, p90: 1657510, cagr: 9.1, color: '#3b82f6' },
      { name: 'Non-AI Stocks', start: 135000, med: 241195, p10: 153698, p90: 383143, cagr: 6.0, color: '#60a5fa' },
      { name: "Int'l Stocks", start: 54000, med: 94412, p10: 58143, p90: 155093, cagr: 5.7, color: '#93c5fd' },
      { name: 'Cyprus Land', start: 337000, med: 661017, p10: 474193, p90: 929854, cagr: 7.0, color: '#22c55e' },
      { name: 'Bonds', start: 162000, med: 250218, p10: 186744, p90: 333478, cagr: 4.4, color: '#a3a3a3' },
      { name: 'Bitcoin', start: 94500, med: 153611, p10: 28891, p90: 829605, cagr: 5.0, color: '#f59e0b' },
      { name: 'Gold', start: 67500, med: 135706, p10: 78429, p90: 237131, cagr: 7.2, color: '#eab308' },
      { name: 'Watches', start: 67500, med: 110481, p10: 80919, p90: 152004, cagr: 5.1, color: '#8b5cf6' },
      { name: 'Cash', start: 108000, med: 153207, p10: 144735, p90: 162149, cagr: 3.6, color: '#6b7280' },
    ],
    final: { p10: 2113661, med: 2847825, mean: 3241311, p90: 4649146 },
  },
  bear: {
    label: 'Bear Case', prob: 25, desc: 'AI disappointment, recession, crypto winter, geopolitical stress',
    yearly: [
      { y: 0, med: 1350000, p10: 1350000, p90: 1350000 }, { y: 1, med: 1373954, p10: 1232505, p90: 1579294 },
      { y: 2, med: 1404967, p10: 1215018, p90: 1705017 }, { y: 3, med: 1441373, p10: 1212938, p90: 1818158 },
      { y: 4, med: 1473806, p10: 1223012, p90: 1922243 }, { y: 5, med: 1512272, p10: 1241811, p90: 2030168 },
      { y: 6, med: 1558451, p10: 1257080, p90: 2121181 }, { y: 7, med: 1606569, p10: 1280228, p90: 2254169 },
      { y: 8, med: 1654550, p10: 1309160, p90: 2333296 }, { y: 9, med: 1714134, p10: 1337180, p90: 2435544 },
      { y: 10, med: 1769063, p10: 1373750, p90: 2537813 },
    ],
    assets: [
      { name: 'AI/Tech Stocks', start: 324000, med: 360199, p10: 154159, p90: 839665, cagr: 1.1, color: '#3b82f6' },
      { name: 'Non-AI Stocks', start: 135000, med: 180419, p10: 101613, p90: 327282, cagr: 2.9, color: '#60a5fa' },
      { name: "Int'l Stocks", start: 54000, med: 68295, p10: 36361, p90: 130270, cagr: 2.4, color: '#93c5fd' },
      { name: 'Cyprus Land', start: 337000, med: 476283, p10: 319963, p90: 718654, cagr: 3.5, color: '#22c55e' },
      { name: 'Bonds', start: 162000, med: 256948, p10: 180089, p90: 366101, cagr: 4.7, color: '#a3a3a3' },
      { name: 'Bitcoin', start: 94500, med: 46263, p10: 5924, p90: 372700, cagr: -6.9, color: '#f59e0b' },
      { name: 'Gold', start: 67500, med: 173174, p10: 91269, p90: 341456, cagr: 9.9, color: '#eab308' },
      { name: 'Watches', start: 67500, med: 90741, p10: 63840, p90: 129849, cagr: 3.0, color: '#8b5cf6' },
      { name: 'Cash', start: 108000, med: 143093, p10: 133453, p90: 153170, cagr: 2.8, color: '#6b7280' },
    ],
    final: { p10: 1373750, med: 1769063, mean: 1916051, p90: 2537813 },
  },
  pw: {
    label: 'Probability-Weighted', prob: 100, desc: '25% Bull + 50% Base + 25% Bear — expected outcome',
    yearly: [
      { y: 0, med: 1350000, p10: 1350000, p90: 1350000 }, { y: 1, med: 1450851, p10: 1313332, p90: 1633094 },
      { y: 2, med: 1566294, p10: 1361234, p90: 1870232 }, { y: 3, med: 1695648, p10: 1424154, p90: 2137040 },
      { y: 4, med: 1840787, p10: 1501155, p90: 2449735 }, { y: 5, med: 2002512, p10: 1591894, p90: 2815826 },
      { y: 6, med: 2182908, p10: 1686686, p90: 3255641 }, { y: 7, med: 2389484, p10: 1796422, p90: 3795753 },
      { y: 8, med: 2638990, p10: 1914382, p90: 4439365 }, { y: 9, med: 2903650, p10: 2045796, p90: 5255582 },
      { y: 10, med: 3219847, p10: 2197458, p90: 6306362 },
    ],
    assets: [
      { name: 'AI/Tech Stocks', start: 324000, med: 742080, cagr: 8.6, color: '#3b82f6' },
      { name: 'Non-AI Stocks', start: 135000, med: 234900, cagr: 5.7, color: '#60a5fa' },
      { name: "Int'l Stocks", start: 54000, med: 90701, cagr: 5.3, color: '#93c5fd' },
      { name: 'Cyprus Land', start: 337000, med: 653527, cagr: 6.8, color: '#22c55e' },
      { name: 'Bonds', start: 162000, med: 249437, cagr: 4.4, color: '#a3a3a3' },
      { name: 'Bitcoin', start: 94500, med: 262942, cagr: 10.8, color: '#f59e0b' },
      { name: 'Gold', start: 67500, med: 160039, cagr: 9.0, color: '#eab308' },
      { name: 'Watches', start: 67500, med: 110839, cagr: 5.1, color: '#8b5cf6' },
      { name: 'Cash', start: 108000, med: 152085, cagr: 3.5, color: '#6b7280' },
    ],
    final: { p10: 2197458, med: 3219847, mean: 4035119, p90: 6306362 },
  },
};

// ── DEFAULT PORTFOLIO CONFIG ──
export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  holdings: [
    { ticker: 'AMZN', name: 'Amazon', shares: 174.34, price: 217.83, costBasis: 217.83, category: 'AI Platforms', conviction: 4 },
    { ticker: 'MSFT', name: 'Microsoft', shares: 92.02, price: 444.97, costBasis: 444.97, category: 'AI Platforms', conviction: 5 },
    { ticker: 'NVDA', name: 'Nvidia', shares: 162.80, price: 178.89, costBasis: 178.89, category: 'AI Infrastructure', conviction: 5 },
    { ticker: 'AVGO', name: 'Broadcom', shares: 82.70, price: 322.74, costBasis: 322.74, category: 'AI Infrastructure', conviction: 4 },
    { ticker: 'GOOGL', name: 'Alphabet', shares: 84.42, price: 306.12, costBasis: 306.12, category: 'AI Platforms', conviction: 4 },
    { ticker: 'CEG', name: 'Constellation Energy', shares: 69.34, price: 295.45, costBasis: 295.45, category: 'Energy/Power', conviction: 4 },
    { ticker: 'META', name: 'Meta Platforms', shares: 34.77, price: 644.44, costBasis: 644.44, category: 'AI Platforms', conviction: 4 },
    { ticker: 'TSLA', name: 'Tesla', shares: 53.78, price: 429.67, costBasis: 429.67, category: 'AI Platforms', conviction: 2 },
    { ticker: 'ETN', name: 'Eaton', shares: 57.27, price: 342.29, costBasis: 342.29, category: 'Energy/Power', conviction: 3 },
    { ticker: 'PLTR', name: 'Palantir', shares: 151.22, price: 153.12, costBasis: 153.12, category: 'AI Platforms', conviction: 3 },
    { ticker: 'VRT', name: 'Vertiv', shares: 43.40, price: 183.40, costBasis: 183.40, category: 'AI Infrastructure', conviction: 3 },
    { ticker: 'MU', name: 'Micron', shares: 24.50, price: 392.46, costBasis: 392.46, category: 'AI Infrastructure', conviction: 4 },
    { ticker: 'INTC', name: 'Intel', shares: 195.60, price: 45.60, costBasis: 45.60, category: 'AI Infrastructure', conviction: 1 },
    { ticker: 'CRWV', name: 'CoreWeave', shares: 85.57, price: 78.44, costBasis: 78.44, category: 'AI Infrastructure', conviction: 2 },
    { ticker: 'APLD', name: 'Applied Digital', shares: 244.60, price: 26.16, costBasis: 26.16, category: 'AI Infrastructure', conviction: 2 },
    { ticker: 'ASML', name: 'ASML', shares: 5.80, price: 1459.12, costBasis: 1459.12, category: 'AI Infrastructure', conviction: 5 },
    { ticker: 'IREN', name: 'IREN', shares: 162.00, price: 44.24, costBasis: 44.24, category: 'AI Infrastructure', conviction: 2 },
    { ticker: 'ANET', name: 'Arista Networks', shares: 169.87, price: 129.67, costBasis: 129.67, category: 'AI Infrastructure', conviction: 4 },
    { ticker: 'COPX', name: 'Global X Copper ETF', shares: 225.01, price: 84.82, costBasis: 84.82, category: 'Commodities', conviction: 3 },
  ],
  theses: {
    MSFT: {
      thesis: "Microsoft is the most durable AI compounder — Azure's 31% growth, Copilot integration across 300M Office seats, and OpenAI partnership create compounding moats that no other platform can replicate.",
      keyDrivers: ['Azure revenue growth stays above 25% YoY', 'Operating margins hold above 43%', 'Copilot adoption accelerates across enterprise'],
      breakConditions: [
        { label: 'Azure growth drops below 20% for 2 consecutive quarters', type: 'manual', value: 0 },
        { label: 'Op margin compresses below 40%', type: 'manual', value: 0 },
        { label: 'Price drops below $350', type: 'price_below', value: 350 },
      ],
      fundamentals: { peRatio: 35, revenueGrowth: 16, fcfMargin: 34, operatingMargin: 46, debtEbitda: 0.5, analystTarget: 510 },
      verdict: 'STRONG BUY', sizing: 'CORRECT',
    },
    NVDA: {
      thesis: "NVIDIA owns the AI training and inference stack end-to-end — CUDA lock-in, Blackwell/GB200 supercycle, and 60%+ operating margins make this the defining infrastructure company of the AI era.",
      keyDrivers: ['Data centre revenue grows above 100% YoY (H100/B200 demand)', 'Operating margins stay above 55%', 'No credible alternative to CUDA emerges in the next 2 years'],
      breakConditions: [
        { label: 'Data centre revenue growth drops below 50% for 2 consecutive quarters', type: 'manual', value: 0 },
        { label: 'AMD/Intel capture >20% of AI training market', type: 'manual', value: 0 },
        { label: 'Price drops below $120', type: 'price_below', value: 120 },
      ],
      fundamentals: { peRatio: 38, revenueGrowth: 122, fcfMargin: 55, operatingMargin: 62, debtEbitda: 0, analystTarget: 220 },
      verdict: 'STRONG BUY', sizing: 'CORRECT',
    },
    AVGO: {
      thesis: "Broadcom is the best risk-adjusted AI infrastructure play — custom AI silicon (XPUs for Google/Meta/Apple), networking dominance, and VMware integration create highly recurring, high-margin revenue streams.",
      keyDrivers: ['AI revenue (XPU/networking) exceeds $12B annualised run rate', 'VMware integration drives margins above 65%', 'Hyperscaler XPU TAM expands'],
      breakConditions: [
        { label: 'Key hyperscaler (Google/Meta) moves away from custom silicon', type: 'manual', value: 0 },
        { label: 'VMware churn exceeds 15%', type: 'manual', value: 0 },
        { label: 'Price drops below $250', type: 'price_below', value: 250 },
      ],
      fundamentals: { peRatio: 37, revenueGrowth: 51, fcfMargin: 46, operatingMargin: 69, debtEbitda: 2.1, analystTarget: 380 },
      verdict: 'STRONG BUY', sizing: 'CORRECT',
    },
    GOOGL: {
      thesis: "Alphabet is a deeply undervalued AI platform — Gemini, TPU infrastructure, YouTube, Waymo, and Google Cloud growing 30%+ make this the cheapest AI megacap on fundamentals.",
      keyDrivers: ['Google Cloud revenue growth stays above 25%', 'Search market share holds above 85% despite AI competitors', 'Waymo commercialisation accelerates'],
      breakConditions: [
        { label: 'Search market share drops below 85% for 2 consecutive quarters', type: 'manual', value: 0 },
        { label: 'Cloud growth decelerates below 20%', type: 'manual', value: 0 },
        { label: 'Price drops below $220', type: 'price_below', value: 220 },
      ],
      fundamentals: { peRatio: 22, revenueGrowth: 14, fcfMargin: 26, operatingMargin: 32, debtEbitda: 0, analystTarget: 220 },
      verdict: 'STRONG BUY', sizing: 'CORRECT',
    },
    AMZN: {
      thesis: "Amazon is the cloud-and-commerce compounding machine — AWS at 19% of revenue but 60%+ of operating profit, with AI inference becoming AWS's next growth leg via Bedrock and Trainium chips.",
      keyDrivers: ['AWS revenue growth stays above 18% YoY', 'Operating income continues expanding (target 10%+ EBIT margin)', 'Advertising revenue sustains 20%+ growth'],
      breakConditions: [
        { label: 'AWS growth drops below 15% for 2 consecutive quarters', type: 'manual', value: 0 },
        { label: 'Price drops below $175', type: 'price_below', value: 175 },
      ],
      fundamentals: { peRatio: 38, revenueGrowth: 11, fcfMargin: 8, operatingMargin: 11, debtEbitda: 0.8, analystTarget: 280 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
    META: {
      thesis: "Meta has the largest AI distribution network on earth — 3.3B daily active users, best-in-class ad targeting improved by AI, and a Llama open-source strategy that builds ecosystem without capex waste.",
      keyDrivers: ['Ad revenue growth stays above 15% YoY', 'Llama adoption grows developer ecosystem', 'Reality Labs losses stabilise or narrow'],
      breakConditions: [
        { label: 'Ad revenue growth drops below 10%', type: 'manual', value: 0 },
        { label: 'Price drops below $500', type: 'price_below', value: 500 },
        { label: 'Reality Labs losses exceed $20B annually', type: 'manual', value: 0 },
      ],
      fundamentals: { peRatio: 28, revenueGrowth: 21, fcfMargin: 38, operatingMargin: 42, debtEbitda: 0, analystTarget: 780 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
    CEG: {
      thesis: "Constellation Energy is the nuclear renaissance play — only US nuclear fleet operator positioned for AI data centre power demand, with Microsoft 20-year PPA providing revenue visibility unmatched in utilities.",
      keyDrivers: ['Nuclear PPA deals with hyperscalers continue (post-Microsoft deal)', 'Three Mile Island restart runs on schedule', 'Federal nuclear support policy remains intact'],
      breakConditions: [
        { label: 'Microsoft or major hyperscaler cancels/renegotiates PPA', type: 'manual', value: 0 },
        { label: 'Nuclear policy reversal at federal level', type: 'manual', value: 0 },
        { label: 'Price drops below $220', type: 'price_below', value: 220 },
      ],
      fundamentals: { peRatio: 38, revenueGrowth: 7, fcfMargin: 12, operatingMargin: 18, debtEbitda: 1.8, analystTarget: 350 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
    ETN: {
      thesis: "Eaton is the electrification and data centre power infrastructure compounder — electrical components for every new data centre built, combined with grid upgrade tailwinds from AI power demand.",
      keyDrivers: ['Data centre orders grow above 20% YoY', 'Electrical segment margins hold above 22%', 'Grid investment cycle continues'],
      breakConditions: [
        { label: 'Data centre capex cycle slows materially', type: 'manual', value: 0 },
        { label: 'Price drops below $280', type: 'price_below', value: 280 },
      ],
      fundamentals: { peRatio: 30, revenueGrowth: 8, fcfMargin: 14, operatingMargin: 22, debtEbitda: 1.5, analystTarget: 415 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
    ANET: {
      thesis: "Arista is the networking backbone of AI infrastructure — spine-and-leaf architecture dominates hyperscaler networks, zero debt, 64% gross margins, and AI cluster interconnect becoming a new growth vector.",
      keyDrivers: ['Revenue growth stays above 20% YoY', 'Gross margins hold above 60%', 'Wins AI cluster networking deals at hyperscalers'],
      breakConditions: [
        { label: 'Cisco or a startup displaces Arista in hyperscaler networking', type: 'manual', value: 0 },
        { label: 'Revenue growth drops below 15%', type: 'manual', value: 0 },
        { label: 'Price drops below $90', type: 'price_below', value: 90 },
      ],
      fundamentals: { peRatio: 48, revenueGrowth: 20, fcfMargin: 35, operatingMargin: 38, debtEbitda: 0, analystTarget: 160 },
      verdict: 'STRONG BUY', sizing: 'CORRECT',
    },
    ASML: {
      thesis: "ASML is the only company on earth that can make the machines that make the chips — EUV lithography monopoly means every node advancement in AI chips (NVDA, TSMC) depends entirely on ASML.",
      keyDrivers: ['EUV/High-NA EUV order book grows above \u20ac36B', 'TSMC/Samsung advanced node capacity expansions continue', "Export controls don't expand beyond China"],
      breakConditions: [
        { label: 'Export controls extended to restrict all advanced node sales', type: 'manual', value: 0 },
        { label: 'Order book cancellations exceed 15%', type: 'manual', value: 0 },
        { label: 'Price drops below $700', type: 'price_below', value: 700 },
      ],
      fundamentals: { peRatio: 28, revenueGrowth: 7, fcfMargin: 24, operatingMargin: 32, debtEbitda: 0, analystTarget: 1100 },
      verdict: 'STRONG BUY', sizing: 'UNDERWEIGHT',
    },
    PLTR: {
      thesis: "Palantir is the government-and-enterprise AI platform with a 20-year head start on ontological data fusion — AIP bootcamp model is creating a genuinely new enterprise software sales motion.",
      keyDrivers: ['US Commercial revenue growth stays above 40% YoY', 'Government contracts expand (defence AI)', 'AIP platform net dollar retention stays above 115%'],
      breakConditions: [
        { label: 'US Commercial growth drops below 25%', type: 'manual', value: 0 },
        { label: 'Government contract losses materially reduce backlog', type: 'manual', value: 0 },
        { label: 'Price drops below $70', type: 'price_below', value: 70 },
      ],
      fundamentals: { peRatio: 218, revenueGrowth: 36, fcfMargin: 20, operatingMargin: 16, debtEbitda: 0, analystTarget: 105 },
      verdict: 'HOLD', sizing: 'OVERWEIGHT',
    },
    MU: {
      thesis: "Micron is the AI memory supercycle play — HBM3E adoption by NVDA (H100/B200), DDR5 transition, and structural DRAM oligopoly with Samsung make this a cyclical with AI structural tailwinds.",
      keyDrivers: ['HBM3E revenue reaches $5B+ annualised by end of 2025', 'DRAM ASPs recover from 2024 lows', 'NVDA maintains Micron as primary HBM supplier'],
      breakConditions: [
        { label: 'DRAM/NAND oversupply re-emerges', type: 'manual', value: 0 },
        { label: 'HBM market share lost to Samsung or SK Hynix', type: 'manual', value: 0 },
        { label: 'Price drops below $70', type: 'price_below', value: 70 },
      ],
      fundamentals: { peRatio: 14, revenueGrowth: 84, fcfMargin: -5, operatingMargin: 22, debtEbitda: 0.8, analystTarget: 130 },
      verdict: 'BUY', sizing: 'UNDERWEIGHT',
    },
    TSLA: {
      thesis: "Tesla optionality play on autonomous vehicles and Optimus robotics — current automotive business is declining but FSD and robotaxi represent a potential category-defining platform if execution follows.",
      keyDrivers: ['FSD unsupervised approval in key US markets by end of 2025', 'Optimus production ramp hits 1000+ units by end of 2025', 'Automotive gross margins recover above 20%'],
      breakConditions: [
        { label: 'FSD regulatory approval delayed beyond 2026', type: 'manual', value: 0 },
        { label: 'Auto gross margin stays below 15% for 3 quarters', type: 'manual', value: 0 },
        { label: 'Price drops below $250', type: 'price_below', value: 250 },
        { label: 'Revenue declines for 3 consecutive quarters', type: 'manual', value: 0 },
      ],
      fundamentals: { peRatio: 241, revenueGrowth: -3, fcfMargin: 3, operatingMargin: 6, debtEbitda: 0, analystTarget: 390 },
      verdict: 'TRIM', sizing: 'OVERWEIGHT',
    },
    VRT: {
      thesis: "Vertiv is the data centre thermal and power management infrastructure play — liquid cooling demand explodes with GPU density, Vertiv is directly correlated to every data centre built.",
      keyDrivers: ['Liquid cooling order book grows above 50% YoY', 'Operating margins expand above 18%', 'AI data centre buildout continues at current pace'],
      breakConditions: [
        { label: 'AI capex cycle decelerates sharply', type: 'manual', value: 0 },
        { label: 'Margins compress below 14%', type: 'manual', value: 0 },
        { label: 'Price drops below $100', type: 'price_below', value: 100 },
      ],
      fundamentals: { peRatio: 35, revenueGrowth: 19, fcfMargin: 10, operatingMargin: 16, debtEbitda: 2.2, analystTarget: 155 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
    INTC: {
      thesis: "Intel is a turnaround bet on foundry and x86 resilience — IFS (Intel Foundry Services) represents a potential re-rating catalyst if 18A node performs, but current fundamentals are deeply broken.",
      keyDrivers: ['18A node yields reach commercial viability (>50% yield)', 'IFS wins at least one major external customer', 'Free cash flow returns to positive by Q4 2025'],
      breakConditions: [
        { label: '18A node delayed beyond Q1 2026', type: 'manual', value: 0 },
        { label: 'FCF stays negative for another year', type: 'manual', value: 0 },
        { label: 'Further market share losses in server CPUs', type: 'manual', value: 0 },
        { label: 'Price drops below $18', type: 'price_below', value: 18 },
      ],
      fundamentals: { peRatio: -8, revenueGrowth: -2, fcfMargin: -15, operatingMargin: -10, debtEbitda: 3.2, analystTarget: 27 },
      verdict: 'EXIT', sizing: 'OVERWEIGHT',
    },
    CRWV: {
      thesis: "CoreWeave is a pure-play AI compute hyperscaler — GPU cloud infrastructure built specifically for AI workloads, with Microsoft as anchor customer. Speculative but the revenue trajectory is exceptional.",
      keyDrivers: ['Revenue run rate hits $5B+ in 2025', 'Microsoft contract renewals and expansions', 'Path to profitability becomes visible (EBITDA positive)'],
      breakConditions: [
        { label: 'Microsoft contract not renewed or significantly reduced', type: 'manual', value: 0 },
        { label: 'Debt/equity ratio deteriorates further', type: 'manual', value: 0 },
        { label: 'Price drops below $40', type: 'price_below', value: 40 },
      ],
      fundamentals: { peRatio: -5, revenueGrowth: 420, fcfMargin: -180, operatingMargin: -45, debtEbitda: 8.5, analystTarget: 55 },
      verdict: 'HOLD', sizing: 'CORRECT',
    },
    APLD: {
      thesis: "Applied Digital is a speculative AI data centre infrastructure play — early mover in purpose-built AI compute campuses, but deeply loss-making and highly leveraged at current scale.",
      keyDrivers: ['Signed capacity utilisation exceeds 80% across campuses', 'Moves to operating cash flow positive', 'Secures additional hyperscaler anchor tenants'],
      breakConditions: [
        { label: 'Operating cash flow stays negative beyond Q2 2025', type: 'manual', value: 0 },
        { label: 'Cannot refinance existing debt', type: 'manual', value: 0 },
        { label: 'Price drops below $8', type: 'price_below', value: 8 },
      ],
      fundamentals: { peRatio: -3, revenueGrowth: 195, fcfMargin: -85, operatingMargin: -62, debtEbitda: 12, analystTarget: 11 },
      verdict: 'HOLD', sizing: 'CORRECT',
    },
    IREN: {
      thesis: "IREN (formerly Iris Energy) is a bitcoin mining and AI compute infrastructure operator — transitioning from pure BTC mining to AI GPU cloud, leveraged to both Bitcoin price and AI compute demand.",
      keyDrivers: ['AI compute revenue exceeds BTC mining revenue by end of 2025', 'Hashrate expansion stays on schedule', 'BTC price stays above $60,000'],
      breakConditions: [
        { label: 'BTC price drops below $50,000 for sustained period', type: 'manual', value: 0 },
        { label: 'AI compute revenue ramp stalls', type: 'manual', value: 0 },
        { label: 'Price drops below $8', type: 'price_below', value: 8 },
      ],
      fundamentals: { peRatio: -12, revenueGrowth: 87, fcfMargin: -30, operatingMargin: -18, debtEbitda: 4.1, analystTarget: 15 },
      verdict: 'HOLD', sizing: 'CORRECT',
    },
    COPX: {
      thesis: "Copper is the raw material of electrification — every data centre, EV, and grid upgrade requires copper. COPX gives diversified exposure to copper miners with leverage to the commodity price cycle.",
      keyDrivers: ['Copper price stays above $3.50/lb', 'Data centre and grid investment continues', 'Supply deficit in copper market widens'],
      breakConditions: [
        { label: 'Copper price drops below $3.20/lb for 60+ days', type: 'manual', value: 0 },
        { label: 'Global manufacturing PMI stays below 48 for 3 months', type: 'manual', value: 0 },
      ],
      fundamentals: { peRatio: 12, revenueGrowth: 8, fcfMargin: 14, operatingMargin: 22, debtEbitda: 0.9, analystTarget: 95 },
      verdict: 'BUY', sizing: 'CORRECT',
    },
  },
  webhookUrl: '',
};
