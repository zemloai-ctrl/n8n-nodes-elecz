# n8n-nodes-elecz

An [n8n](https://n8n.io/) community node for [Elecz](https://elecz.com) — real-time electricity price signals and contract comparison for Germany and Nordic markets.

## Operations

| Operation | Description |
|---|---|
| **Optimize** | One-call optimization — best action right now |
| **Spot Price** | Current electricity spot price for a zone |
| **Cheapest Hours** | Cheapest upcoming hours in the next 24h |
| **Energy Decision Signal** | Full decision signal: price level, trend, recommendation |
| **Best Energy Contract** | Top 3 contracts ranked by your consumption profile |

## Supported Zones

**Germany:** DE  
**Nordic:** FI, SE, SE1–SE4, NO, NO1–NO5, DK, DK1–DK2

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
2. Zone: `DE`
3. Consumption: `3500` kWh/year

## Links

- API docs: [elecz.com/docs](https://elecz.com/docs)
- MCP server: [elecz.com/mcp](https://elecz.com/mcp)
- GitHub: [zemloai-ctrl/n8n-nodes-elecz](https://github.com/zemloai-ctrl/n8n-nodes-elecz)

## License

MIT
