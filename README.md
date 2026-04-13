n8n-nodes-elecz
An n8n community node for Elecz — real-time electricity price signals and contract recommendations for Europe and Oceania.
Operations
OperationDescriptionSpot PriceCurrent electricity spot price for a zoneCheapest HoursCheapest upcoming hours in the next 24hBest Energy ContractTop contracts ranked by your consumption profile
Supported Zones
Europe: FI, SE, SE1–SE4, NO, NO1–NO5, DK, DK1–DK2, DE, GB
Oceania: AU-NSW, AU-VIC, AU-QLD, AU-SA, AU-TAS, NZ-NI, NZ-SI
Installation
In your n8n instance:

Go to Settings → Community Nodes
Click Install
Enter n8n-nodes-elecz
Confirm install

Usage
No API key required. Elecz is a public read-only API.
Example: Cheapest hours automation

Add Elecz node
Operation: Cheapest Hours
Zone: FI
Hours needed: 3
Connect to your automation

Example: Contract comparison

Operation: Best Energy Contract
Zone: DE
Consumption: 3500 kWh/year

Links

API docs: elecz.com/docs
MCP server: elecz.com/mcp
GitHub: zemloai-ctrl/n8n-nodes-elecz

License
MIT
