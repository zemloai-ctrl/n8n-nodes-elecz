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
		description: 'Get real-time electricity price signals and contract comparisons for Nordic and German markets',
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
						name: 'Best Energy Contract',
						value: 'best_energy_contract',
						description: 'Find the best electricity contract for your consumption',
						action: 'Find best energy contract',
					},
					{
						name: 'Cheapest Hours',
						value: 'cheapest_hours',
						description: 'Get the cheapest upcoming hours to use energy',
						action: 'Get cheapest hours',
					},
					{
						name: 'Energy Decision Signal',
						value: 'energy_decision_signal',
						description: 'Get a full energy decision signal for a zone',
						action: 'Get energy decision signal',
					},
					{
						name: 'Optimize',
						value: 'optimize',
						description: 'Get a one-call electricity optimization recommendation',
						action: 'Optimize electricity usage',
					},
				],
				default: 'spot_price',
			},

			// Zone — shared across all operations
			{
				displayName: 'Zone',
				name: 'zone',
				type: 'options',
				options: [
					{ name: 'Finland (FI)', value: 'FI' },
					{ name: 'Sweden (SE1)', value: 'SE1' },
					{ name: 'Sweden (SE2)', value: 'SE2' },
					{ name: 'Sweden (SE3)', value: 'SE3' },
					{ name: 'Sweden (SE4)', value: 'SE4' },
					{ name: 'Norway (NO1)', value: 'NO1' },
					{ name: 'Norway (NO2)', value: 'NO2' },
					{ name: 'Norway (NO5)', value: 'NO5' },
					{ name: 'Denmark (DK1)', value: 'DK1' },
					{ name: 'Denmark (DK2)', value: 'DK2' },
					{ name: 'Estonia (EE)', value: 'EE' },
					{ name: 'Latvia (LV)', value: 'LV' },
					{ name: 'Lithuania (LT)', value: 'LT' },
					{ name: 'Germany (DE-LU)', value: 'DE-LU' },
				],
				default: 'FI',
				description: 'Electricity price zone',
				displayOptions: {
					show: {
						operation: ['spot_price', 'best_energy_contract', 'cheapest_hours', 'energy_decision_signal', 'optimize'],
					},
				},
			},

			// Consumption — for contract and optimize
			{
				displayName: 'Annual Consumption (kWh)',
				name: 'consumption_kwh',
				type: 'number',
				default: 2000,
				description: 'Your annual electricity consumption in kWh. Nordic default: 2000, German default: 3500.',
				displayOptions: {
					show: {
						operation: ['best_energy_contract', 'optimize'],
					},
				},
			},

			// Contract type filter
			{
				displayName: 'Contract Type',
				name: 'contract_type',
				type: 'options',
				options: [
					{ name: 'Any', value: '' },
					{ name: 'Spot', value: 'spot' },
					{ name: 'Fixed', value: 'fixed' },
					{ name: 'Dynamic', value: 'dynamic' },
					{ name: 'Hybrid', value: 'hybrid' },
				],
				default: '',
				description: 'Filter by contract type (leave empty for all types)',
				displayOptions: {
					show: {
						operation: ['best_energy_contract'],
					},
				},
			},

			// Current price for savings calculation
			{
				displayName: 'Current Price (c/kWh)',
				name: 'current_price_ckwh',
				type: 'number',
				default: 0,
				description: 'Your current electricity price in cents/kWh. Used to calculate potential savings.',
				displayOptions: {
					show: {
						operation: ['best_energy_contract'],
					},
				},
			},

			// Hours needed — for cheapest_hours
			{
				displayName: 'Hours Needed',
				name: 'hours_needed',
				type: 'number',
				default: 3,
				description: 'How many cheap hours you need in the next 24 hours',
				displayOptions: {
					show: {
						operation: ['cheapest_hours'],
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
				url = `${BASE_URL}/spot_price?${params}`;

			} else if (operation === 'best_energy_contract') {
				const consumption = this.getNodeParameter('consumption_kwh', i) as number;
				const contractType = this.getNodeParameter('contract_type', i) as string;
				const currentPrice = this.getNodeParameter('current_price_ckwh', i) as number;
				params.append('consumption_kwh', String(consumption));
				if (contractType) params.append('contract_type', contractType);
				if (currentPrice > 0) params.append('current_price_ckwh', String(currentPrice));
				url = `${BASE_URL}/best_energy_contract?${params}`;

			} else if (operation === 'cheapest_hours') {
				const hours = this.getNodeParameter('hours_needed', i) as number;
				params.append('hours_needed', String(hours));
				url = `${BASE_URL}/cheapest_hours?${params}`;

			} else if (operation === 'energy_decision_signal') {
				url = `${BASE_URL}/energy_decision_signal?${params}`;

			} else if (operation === 'optimize') {
				const consumption = this.getNodeParameter('consumption_kwh', i) as number;
				params.append('consumption_kwh', String(consumption));
				url = `${BASE_URL}/optimize?${params
