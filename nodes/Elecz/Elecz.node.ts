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
		description: 'Get real-time electricity price signals and contract recommendations for Europe and Oceania',
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
						description: 'Get the cheapest upcoming hours in the next 24h',
						action: 'Get cheapest hours',
					},
					{
						name: 'Best Energy Contract',
						value: 'best_energy_contract',
						description: 'Top contracts ranked by your consumption profile',
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
					{ name: 'Finland (FI)', value: 'FI' },
					{ name: 'Sweden (SE)', value: 'SE' },
					{ name: 'Sweden SE1', value: 'SE1' },
					{ name: 'Sweden SE2', value: 'SE2' },
					{ name: 'Sweden SE3', value: 'SE3' },
					{ name: 'Sweden SE4', value: 'SE4' },
					{ name: 'Norway (NO)', value: 'NO' },
					{ name: 'Norway NO1', value: 'NO1' },
					{ name: 'Norway NO2', value: 'NO2' },
					{ name: 'Norway NO3', value: 'NO3' },
					{ name: 'Norway NO4', value: 'NO4' },
					{ name: 'Norway NO5', value: 'NO5' },
					{ name: 'Denmark (DK)', value: 'DK' },
					{ name: 'Denmark DK1', value: 'DK1' },
					{ name: 'Denmark DK2', value: 'DK2' },
					{ name: 'Germany (DE)', value: 'DE' },
					{ name: 'United Kingdom (GB)', value: 'GB' },
					{ name: 'Australia NSW', value: 'AU-NSW' },
					{ name: 'Australia VIC', value: 'AU-VIC' },
					{ name: 'Australia QLD', value: 'AU-QLD' },
					{ name: 'Australia SA', value: 'AU-SA' },
					{ name: 'Australia TAS', value: 'AU-TAS' },
					{ name: 'New Zealand North Island', value: 'NZ-NI' },
					{ name: 'New Zealand South Island', value: 'NZ-SI' },
				],
				default: 'FI',
				description: 'Electricity price zone',
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
				description: 'Annual electricity consumption in kWh. Nordic default: 2000, Germany default: 3500.',
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
					{ name: 'Electric Heating', value: 'electric' },
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
				url = `${BASE_URL}/signal?${params}`;
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
