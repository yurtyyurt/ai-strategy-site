export interface Holding {
  ticker: string;
  name: string;
  shares: number;
  price: number;
  costBasis: number;
  category: string;
  conviction: number;
}

export interface BreakCondition {
  label: string;
  type: 'manual' | 'price_below' | 'price_above';
  value: number;
}

export interface Fundamentals {
  peRatio: number;
  revenueGrowth: number;
  fcfMargin: number;
  operatingMargin: number;
  debtEbitda: number;
  analystTarget: number;
}

export type Verdict = 'STRONG BUY' | 'BUY' | 'HOLD' | 'TRIM' | 'EXIT';
export type Sizing = 'UNDERWEIGHT' | 'CORRECT' | 'OVERWEIGHT';

export interface Thesis {
  thesis: string;
  keyDrivers: string[];
  breakConditions: BreakCondition[];
  fundamentals: Fundamentals;
  verdict: Verdict;
  sizing: Sizing;
}

export interface PortfolioConfig {
  holdings: Holding[];
  theses: Record<string, Thesis>;
  webhookUrl: string;
}

export interface Alert {
  ticker: string;
  label: string;
  id: string;
}

export interface ExitRule {
  priority: 'high' | 'medium';
  name: string;
  trigger: string;
  action: string;
}

export interface FcYearly {
  y: number;
  med: number;
  p10: number;
  p90: number;
}

export interface FcAsset {
  name: string;
  start: number;
  med: number;
  p10?: number;
  p90?: number;
  cagr: number;
  color: string;
}

export interface FcScenario {
  label: string;
  prob: number;
  desc: string;
  yearly: FcYearly[];
  assets: FcAsset[];
  final: { p10: number; med: number; mean: number; p90: number };
}
