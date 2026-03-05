/** Represents price data for a single crypto asset */
export interface AssetPrice {
    price: number;
    change24h: number;
    name: string;
    symbol: string;
  }
  
  /** Full price data for all tracked assets */
  export interface PriceData {
    ETH: AssetPrice;
    BTC: AssetPrice;
    USDC: AssetPrice;
  }
  
  /** Fallback mock data used when CoinGecko API is unavailable */
  const MOCK_PRICES: PriceData = {
    ETH:  { price: 2500,  change24h: 1.2, name: 'Ethereum', symbol: 'ETH'  },
    BTC:  { price: 65000, change24h: 0.8, name: 'Bitcoin',  symbol: 'BTC'  },
    USDC: { price: 1.00,  change24h: 0.0, name: 'USD Coin', symbol: 'USDC' },
  };
  
  /**
   * Fetches live cryptocurrency prices from CoinGecko.
   * Falls back to mock data if the request fails.
   */
  export async function getPrices(): Promise<PriceData> {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin&vs_currencies=usd&include_24hr_change=true',
        { next: { revalidate: 30 } }
      );
  
      if (!res.ok) throw new Error(`CoinGecko responded with ${res.status}`);
  
      const data = await res.json();
  
      return {
        ETH: {
          price:     data.ethereum?.usd              ?? MOCK_PRICES.ETH.price,
          change24h: data.ethereum?.usd_24h_change   ?? MOCK_PRICES.ETH.change24h,
          name:   'Ethereum',
          symbol: 'ETH',
        },
        BTC: {
          price:     data.bitcoin?.usd               ?? MOCK_PRICES.BTC.price,
          change24h: data.bitcoin?.usd_24h_change    ?? MOCK_PRICES.BTC.change24h,
          name:   'Bitcoin',
          symbol: 'BTC',
        },
        USDC: {
          price:     data['usd-coin']?.usd            ?? MOCK_PRICES.USDC.price,
          change24h: data['usd-coin']?.usd_24h_change ?? MOCK_PRICES.USDC.change24h,
          name:   'USD Coin',
          symbol: 'USDC',
        },
      };
    } catch (err) {
      console.warn('getPrices: falling back to mock data.', err);
      return MOCK_PRICES;
    }
  }
  
  /**
   * Formats a number as a USD price string.
   * e.g. 2540.5 → "$2,540.50", 65234 → "$65,234.00"
   */
  export function formatPrice(price: number): string {
    return price.toLocaleString('en-US', {
      style:                 'currency',
      currency:              'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  /**
   * Returns the drift between current and target allocation percentages.
   * Positive = overweight, negative = underweight.
   */
  export function getDrift(current: number, target: number): number {
    return current - target;
  }