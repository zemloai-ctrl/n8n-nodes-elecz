import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Elecz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Elecz',
		name: 'elecz',
		icon: 'file:elecz.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Real-time electricity price signals for 40+ countries across Europe, North America, Asia, and Oceania. No API key required.',
		defaults: {
			name: 'Elecz',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Spot Price',
						value: 'spot_price',
						description: 'Get current electricity spot price for a zone',
						action: 'Get spot price',
					},
					{
						name: 'Cheapest Hours',
						value: 'cheapest_hours',
						description: 'Get the cheapest upcoming hours in the next 24–48h',
						action: 'Get cheapest hours',
					},
					{
						name: 'Best Energy Contract',
						value: 'best_energy_contract',
						description: 'Compare electricity contracts ranked by your consumption profile',
						action: 'Find best energy contract',
					},
				],
				default: 'spot_price',
			},
			{
				displayName: 'Zone',
				name: 'zone',
				type: 'options',
				options: [
					// Europe — Nordic
					{ name: 'Finland (FI)', value: 'FI' },
					{ name: 'Sweden (SE)', value: 'SE' },
					{ name: 'Sweden SE1 — Luleå', value: 'SE1' },
					{ name: 'Sweden SE2 — Sundsvall', value: 'SE2' },
					{ name: 'Sweden SE3 — Stockholm', value: 'SE3' },
					{ name: 'Sweden SE4 — Malmö', value: 'SE4' },
					{ name: 'Norway (NO)', value: 'NO' },
					{ name: 'Norway NO1 — Oslo', value: 'NO1' },
					{ name: 'Norway NO2 — Kristiansand', value: 'NO2' },
					{ name: 'Norway NO3 — Trondheim', value: 'NO3' },
					{ name: 'Norway NO4 — Tromsø', value: 'NO4' },
					{ name: 'Norway NO5 — Bergen', value: 'NO5' },
					{ name: 'Denmark (DK)', value: 'DK' },
					{ name: 'Denmark DK1 — West', value: 'DK1' },
					{ name: 'Denmark DK2 — East', value: 'DK2' },
					// Europe — Baltic
					{ name: 'Estonia (EE)', value: 'EE' },
					{ name: 'Latvia (LV)', value: 'LV' },
					{ name: 'Lithuania (LT)', value: 'LT' },
					// Europe — Central & West
					{ name: 'Germany (DE)', value: 'DE' },
					{ name: 'Netherlands (NL)', value: 'NL' },
					{ name: 'Belgium (BE)', value: 'BE' },
					{ name: 'Austria (AT)', value: 'AT' },
					{ name: 'France (FR)', value: 'FR' },
					{ name: 'Switzerland (CH)', value: 'CH' },
					{ name: 'United Kingdom (GB)', value: 'GB' },
					{ name: 'Ireland (IE)', value: 'IE' },
					// Europe — South & East
					{ name: 'Spain (ES)', value: 'ES' },
					{ name: 'Portugal (PT)', value: 'PT' },
					{ name: 'Italy (IT)', value: 'IT' },
					{ name: 'Italy IT-North', value: 'IT-NO' },
					{ name: 'Italy IT-Centre-North', value: 'IT-CNO' },
					{ name: 'Italy IT-Centre-South', value: 'IT-CSO' },
					{ name: 'Italy IT-South', value: 'IT-SO' },
					{ name: 'Italy IT-Sardinia', value: 'IT-SAR' },
					{ name: 'Italy IT-Sicily', value: 'IT-SIC' },
					{ name: 'Poland (PL)', value: 'PL' },
					{ name: 'Czech Republic (CZ)', value: 'CZ' },
					{ name: 'Hungary (HU)', value: 'HU' },
					{ name: 'Romania (RO)', value: 'RO' },
					{ name: 'Croatia (HR)', value: 'HR' },
					{ name: 'Slovenia (SI)', value: 'SI' },
					{ name: 'Slovakia (SK)', value: 'SK' },
					{ name: 'Bulgaria (BG)', value: 'BG' },
					{ name: 'Greece (GR)', value: 'GR' },
					{ name: 'Serbia (RS)', value: 'RS' },
					{ name: 'Bosnia and Herzegovina (BA)', value: 'BA' },
					{ name: 'Montenegro (ME)', value: 'ME' },
					{ name: 'North Macedonia (MK)', value: 'MK' },
					// North America
					{ name: 'Canada — Ontario (CA-ON)', value: 'CA-ON' },
					{ name: 'USA — California NP15', value: 'US-CA-NP15' },
					{ name: 'USA — California SP15', value: 'US-CA-SP15' },
					{ name: 'USA — California ZP26', value: 'US-CA-ZP26' },
					{ name: 'USA — Texas Hub North', value: 'US-TX-HB_NORTH' },
					{ name: 'USA — Texas Houston', value: 'US-TX-HOUSTON' },
					{ name: 'USA — Texas Hub South', value: 'US-TX-HB_SOUTH' },
					{ name: 'USA — Texas Hub West', value: 'US-TX-HB_WEST' },
					{ name: 'USA — Texas Hub Average', value: 'US-TX-HUBAVG' },
					{ name: 'USA — New York NYC', value: 'US-NY-NYC' },
					{ name: 'USA — New York West', value: 'US-NY-WEST' },
					{ name: 'USA — New York Long Island', value: 'US-NY-LONGIL' },
					// Asia
					{ name: 'South Korea (KR)', value: 'KR' },
					{ name: 'South Korea — Jeju Island', value: 'KR-JEJU' },
					{ name: 'Japan — Hokkaido (JP-HKD)', value: 'JP-HKD' },
					{ name: 'Japan — Tohoku (JP-THK)', value: 'JP-THK' },
					{ name: 'Japan — Tokyo (JP-TKY)', value: 'JP-TKY' },
					{ name: 'Japan — Chubu (JP-CBU)', value: 'JP-CBU' },
					{ name: 'Japan — Hokuriku (JP-HKR)', value: 'JP-HKR' },
					{ name: 'Japan — Kansai (JP-KNS)', value: 'JP-KNS' },
					{ name: 'Japan — Chugoku (JP-CGK)', value: 'JP-CGK' },
					{ name: 'Japan — Shikoku (JP-SKK)', value: 'JP-SKK' },
					{ name: 'Japan — Kyushu (JP-KYS)', value: 'JP-KYS' },
					// Africa
					{ name: 'South Africa (ZA)', value: 'ZA' },
					// Southeast Asia / Pacific
					{ name: 'Philippines — Luzon (PH-LUZ)', value: 'PH-LUZ' },
					{ name: 'Philippines — Visayas (PH-VIS)', value: 'PH-VIS' },
					{ name: 'Philippines — Mindanao (PH-MIN)', value: 'PH-MIN' },
					// Oceania
					{ name: 'Australia — NSW', value: 'AU-NSW' },
					{ name: 'Australia — VIC', value: 'AU-VIC' },
					{ name: 'Australia — QLD', value: 'AU-QLD' },
					{ name: 'Australia — SA', value: 'AU-SA' },
					{ name: 'Australia — TAS', value: 'AU-TAS' },
					{ name: 'New Zealand — North Island', value: 'NZ-NI' },
					{ name: 'New Zealand — South Island', value: 'NZ-SI' },
				],
				default: 'FI',
				description: 'Electricity price zone. 40+ countries across Europe, North America, Asia, and Oceania.',
				displayOptions: {
					show: {
						operation: ['spot_price', 'cheapest_hours', 'best_energy_contract'],
					},
				},
			},
			{
				displayName: 'Hours Needed',
				name: 'hours',
				type: 'number',
				default: 5,
				description: 'How many cheapest hours to return (default 5)',
				displayOptions: {
					show: {
						operation: ['cheapest_hours'],
					},
				},
			},
			{
				displayName: 'Look Ahead (hours)',
				name: 'window',
				type: 'number',
				default: 24,
				description: 'How many hours to look ahead (default 24, max 48)',
				displayOptions: {
					show: {
						operation: ['cheapest_hours'],
					},
				},
			},
			{
				displayName: 'Annual Consumption (kWh)',
				name: 'consumption',
				type: 'number',
				default: 2000,
				description: 'Annual electricity consumption in kWh. Nordic default: 2000, Germany: 3500, UK: 2700, Australia: 4500.',
				displayOptions: {
					show: {
						operation: ['best_energy_contract'],
					},
				},
			},
			{
				displayName: 'Heating Type',
				name: 'heating',
				type: 'options',
				options: [
					{ name: 'District Heating', value: 'district' },
					{ name: 'Electric Heating / Heat Pump', value: 'electric' },
				],
				default: 'district',
				displayOptions: {
					show: {
						operation: ['best_energy_contract'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const BASE_URL = 'https://elecz.com';

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const zone = this.getNodeParameter('zone', i) as string;

			let url = '';
			const params = new URLSearchParams({ zone });

			if (operation === 'spot_price') {
				url = `${BASE_URL}/signal/spot?${params}`;

			} else if (operation === 'cheapest_hours') {
				const hours = this.getNodeParameter('hours', i) as number;
				const window = this.getNodeParameter('window', i) as number;
				params.append('hours', String(hours));
				params.append('window', String(window));
				url = `${BASE_URL}/signal/cheapest-hours?${params}`;

			} else if (operation === 'best_energy_contract') {
				const consumption = this.getNodeParameter('consumption', i) as number;
				const heating = this.getNodeParameter('heating', i) as string;
				params.append('consumption', String(consumption));
				params.append('heating', heating);
				url = `${BASE_URL}/signal/contract?${params}`;
			}

			try {
				const response = await this.helpers.request({
					method: 'GET',
					url,
					json: true,
				});

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
