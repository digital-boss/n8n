import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// import { googleApiRequest, googleApiRequestAllItems, merge, simplify } from './GenericFunctions';

export class GoogleAds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Ads',
		name: 'googleAds',
		icon: 'file:google-ads.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use the Google Ads API',
		defaults: {
			name: 'Google Ads',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleAdsOAuth2',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Customer Custom Audiences',
						value: 'customerCustomAudiences',
					},
				],
				default: 'customerCustomAudiences',
			},
			// Customer Custom Audiences
			// GET
			{
				displayName: 'Resource Name',
				name: 'resourceName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['get'],
						resource: ['customerCustomAudiences'],
					},
				},
				default: '',
				description: 'The resource name of the custom audience to fetch.',
			},
			// MUTATE
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['mutate'],
						resource: ['customerCustomAudiences'],
					},
				},
				default: '',
				description: 'The ID of the customer whose custom audiences are being modified.',
			},
			{
				displayName: 'Operations',
				name: 'operations',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['mutate'],
						resource: ['customerCustomAudiences'],
					},
				},
				default: '',
				description: 'The list of operations to perform on individual custom audiences.',
			},
			{
				displayName: 'Validate Only',
				name: 'validateOnly',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['mutate'],
						resource: ['customerCustomAudiences'],
					},
				},
				default: false,
				description:
					'If true, the request is validated but not executed. Only errors are returned, not results.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let method = '';
		const body: IDataObject = {};
		const qs: IDataObject = {};
		let endpoint = '';
		let responseData;
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'customerCustomAudiences') {
					if (operation === 'get') {
						method = 'GET';
						const resourceName = this.getNodeParameter('resourceName', i) as string;
						endpoint = `/v9/{resourceName=${resourceName}/*/customAudiences/*}`;
						console.log(resourceName);
					} else if (operation == 'mutate') {
						method = 'POST';
						const customerId = this.getNodeParameter('customerId', i) as string;
						endpoint = `/v9/customers/${customerId}/customAudiences:mutate`;
						let operations = this.getNodeParameter('operations', i) as IDataObject;
						if (typeof operations === 'string') {
							operations = JSON.parse(operations);
						}
						if (!Array.isArray(operations)) {
							throw new NodeOperationError(
								this.getNode(),
								'You must provide an array or a JSON representation of an array. Entries of this array need to be opeartions compatible with this API Endpoint.',
							);
						}
						body.operations = operations;
						body.validateOnly = this.getNodeParameter('validateOnly', i) as boolean;
						console.log(body);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					//@ts-ignore
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
