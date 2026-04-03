# n8n-nodes-elecz

An [n8n](https://n8n.io/) community node for [Elecz](https://elecz.com) — real-time electricity price signals and contract comparison for Nordic and German markets.

## Operations

| Operation | Description |
|---|---|
| **Spot Price** | Current electricity spot price for a zone |
| **Best Energy Contract** | Top 3 contracts ranked by your consumption profile |
| **Cheapest Hours** | Cheapest upcoming hours in the next 24h |
| **Energy Decision Signal** | Full decision signal: price level, trend, recommendation |
| **Optimize** | One-call optimization — best action right now |

## Supported Zones

**Nordic/Baltic:** FI, SE1–SE4, NO1, NO2, NO5, DK1, DK2, EE, LV, LT  
**Germany:** DE-LU

## Installation

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-elecz`
4. Confirm install

## Usage

No API key required. Elecz is a public read-only API.

### Example: Cheapest hours automation

1. Add **Elecz** node
2. Operation: `Cheapest Hours`
3. Zone: `FI`
4. Hours needed: `3`
5. Connect to your washing machine / EV charger automation

### Example: Contract comparison

1. Operation: `Best Energy Contract`
2. Zone: `FI`
3. Consumption: `2000` kWh/year
4. Current price: `7.5` c/kWh → get savings estimate

## Links

- API docs: [elecz.com/docs](https://elecz.com/docs)
- MCP server: [elecz.com/mcp](https://elecz.com/mcp)
- GitHub: [zemloai-ctrl/n8n-nodes-elecz](https://github.com/zemloai-ctrl/n8n-nodes-elecz)

## License

MIT
