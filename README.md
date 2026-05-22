# n8n-nodes-elecz

An n8n community node for Elecz — real-time electricity price signals and contract recommendations for 40+ countries and 100+ zones across Europe, North America, Asia, Africa, and Oceania. No API key required.

## Operations

| Operation | Description |
|---|---|
| Spot Price | Current electricity spot price for a zone |
| Cheapest Hours | Cheapest upcoming hours in the next 24–48h, with ready-to-use automation signals |
| Best Energy Contract | Contracts ranked by your consumption profile |

## Supported Zones

**Europe — Nordic:** FI, SE, SE1–SE4, NO, NO1–NO5, DK, DK1–DK2

**Europe — Baltic:** EE, LV, LT

**Europe — Central & West:** DE, NL, BE, AT, FR, CH, GB, IE

**Europe — South & East:** ES, PT, IT (IT-NO, IT-CNO, IT-CSO, IT-SO, IT-SAR, IT-SIC), PL, CZ, HU, RO, HR, SI, SK, BG, GR, RS, BA, ME, MK

**North America:** Ontario (CA-ON), California (CAISO), Texas (ERCOT), New York (NYISO), Mexico — Monterrey, Guadalajara, Cancun and 11 more cities

**Asia:** KR, KR-JEJU, JP-HKD/THK/TKY/CBU/HKR/KNS/CGK/SKK/KYS

**Africa:** ZA

**Southeast Asia:** PH-LUZ, PH-VIS, PH-MIN

**Oceania:** AU-NSW, AU-VIC, AU-QLD, AU-SA, AU-TAS, NZ-NI, NZ-SI

## Installation

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-elecz`
4. Confirm install

## Usage

No API key required. Elecz is a public read-only API.

### Example: Current spot price

1. Operation: **Spot Price**
2. Zone: **AU-NSW**
3. Returns: price, unit, signal level (low / medium / high / spike)

### Example: Cheapest hours automation

1. Operation: **Cheapest Hours**
2. Zone: **DE**
3. Hours needed: **3**
4. Connect output to an IF node using `current_hour_is_cheap` (boolean) as the trigger

Useful fields for automation:

| Field | Use |
|---|---|
| `current_hour_is_cheap` | Boolean — wire directly into IF node |
| `hours_until_next_cheap` | How long to wait before the next cheap window |
| `cheap_window_ends` | When the current cheap window closes |
| `cheap_hours_remaining_today` | How many cheap hours are left today |

**Home automation:** EV charging, washing machine, dishwasher, heat pump, battery charging.

**Industrial & business:** The same signals work at any scale. Schedule pumping stations, compressors, refrigeration units, or batch processes during the cheapest hours. A factory running a 50 kW pump 6 hours a day can save thousands of euros per year by shifting load to off-peak windows — with no changes to the process, just the schedule. Other use cases: ML training jobs, backup pipelines, cold storage pre-cooling, and battery arbitrage (charge cheap, discharge expensive).

### Example: Contract comparison

1. Operation: **Best Energy Contract**
2. Zone: **GB**
3. Consumption: **2700 kWh/year**
4. Returns: best spot and fixed contracts with estimated annual savings

## Links

- API docs: [elecz.com/docs](https://elecz.com/docs)
- MCP server: [elecz.com/mcp](https://elecz.com/mcp)
- GitHub: [zemloai-ctrl/n8n-nodes-elecz](https://github.com/zemloai-ctrl/n8n-nodes-elecz)

## License

MIT
