/** Dollar values for each asset in the portfolio */
export interface Portfolio {
    ETH: number;
    BTC: number;
    USDC: number;
  }
  
  /** Percentage allocations for each asset (0–100) */
  export interface Allocations {
    ETH: number;
    BTC: number;
    USDC: number;
  }
  
  /** A recorded rebalancing event */
  export interface RebalanceEvent {
    id: string;
    timestamp: Date;
    actions: string[];
    txHash: string;
    totalValue: number;
  }
  
  /** Starting portfolio in USD */
  export const STARTING_PORTFOLIO: Portfolio = {
    ETH: 5000,
    BTC: 3000,
    USDC: 2000,
  };
  
  /** Target allocation percentages */
  export const TARGET_ALLOCATIONS: Allocations = {
    ETH: 50,
    BTC: 30,
    USDC: 20,
  };
  
  /**
   * Calculates the percentage allocation of each asset.
   * Returns 0 for all if total value is 0 (avoids division by zero).
   */
  export function calculateAllocations(portfolio: Portfolio): Allocations {
    const total = calculateTotalValue(portfolio);
    if (total === 0) return { ETH: 0, BTC: 0, USDC: 0 };
    return {
      ETH:  (portfolio.ETH  / total) * 100,
      BTC:  (portfolio.BTC  / total) * 100,
      USDC: (portfolio.USDC / total) * 100,
    };
  }
  
  /**
   * Returns the total USD value of the portfolio.
   */
  export function calculateTotalValue(portfolio: Portfolio): number {
    return portfolio.ETH + portfolio.BTC + portfolio.USDC;
  }
  
  /**
   * Generates a fake Ethereum-style transaction hash.
   * Format: "0x" + 64 random hex characters.
   */
  export function generateTxHash(): string {
    const hex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return `0x${hex}`;
  }
  
  /**
   * Simulates a portfolio rebalance event.
   * Creates a RebalanceEvent with a unique ID, timestamp, and fake TX hash.
   */
  export function simulateRebalance(actions: any[]): RebalanceEvent {
    const actionStrings: string[] = actions.map((a) =>
      typeof a === 'string'
        ? a
        : `${a.action?.toUpperCase() ?? 'ACTION'} ${a.asset ?? ''} — $${a.dollarAmount ?? 0}`
    );
  
    return {
      id:         Math.random().toString(36).slice(2, 10),
      timestamp:  new Date(),
      actions:    actionStrings,
      txHash:     generateTxHash(),
      totalValue: calculateTotalValue(STARTING_PORTFOLIO),
    };
  }
  
  /**
   * Returns a portfolio with values adjusted for current market prices.
   * USDC always stays at $2,000 (stablecoin).
   */
  export function getPortfolioWithPrices(basePrices: {
    ETH?: { price: number };
    BTC?: { price: number };
  }): Portfolio {
    const ethPrice = basePrices?.ETH?.price ?? 2500;
    const btcPrice = basePrices?.BTC?.price ?? 65000;
  
    return {
      ETH:  5000 * (ethPrice / 2500),
      BTC:  3000 * (btcPrice / 65000),
      USDC: 2000,
    };
  }