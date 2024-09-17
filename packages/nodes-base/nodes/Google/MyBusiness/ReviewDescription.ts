import type { INodeProperties } from 'n8n-workflow';
import { getPaginator } from './GenericFunctions';

export const reviewOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'get',
		noDataExpression: true,
		displayOptions: { show: { resource: ['review'] } },
		options: [
			{
				name: 'Delete Reply',
				value: 'delete',
				action: 'Delete a reply to a review',
				description: 'Delete a reply to a review',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/{{$parameter["account"]}}/{{$parameter["location"]}}/{{$parameter["reviewName"]/reply}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get review',
				description: 'Retrieve details of a specific review on Google My Business',
				routing: {
					request: {
						method: 'GET',
						url: '=/{{$parameter["account"]}}/{{$parameter["location"]}}/{{$parameter["reviewName"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reviews',
				description: 'Retrieve multiple reviews',
				routing: {
					send: { paginate: true },
					operations: { pagination: getPaginator('reviews') },
					request: {
						method: 'GET',
						url: '=/{{$parameter["account"]}}/{{$parameter["location"]}}/reviews',
						qs: {
							pageSize: '={{$parameter["limit"]<50 ? $parameter["limit"] : 50}}', // Google allows maximum 50 results per page
						},
					},
				},
			},
			{
				name: 'Reply',
				value: 'reply',
				action: 'Reply to review',
				description: 'Reply to a review',
				routing: {
					request: {
						method: 'PUT',
						url: '=/{{$parameter["account"]}}/{{$parameter["location"]}}/{{$parameter["reviewName"]}}/reply',
					},
				},
			},
		],
	},
];

export const reviewFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 review:get                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account',
		name: 'account',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The Google My Business account name',
		displayOptions: { show: { resource: ['review'], operation: ['get'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the account name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'accounts/[0-9]+',
							errorMessage: 'The name must start with "accounts/"',
						},
					},
				],
				placeholder: 'accounts/012345678901234567890',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchAccounts',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Location',
		name: 'location',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The specific location or business associated with the account',
		displayOptions: { show: { resource: ['review'], operation: ['get'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'locations/[0-9]+',
							errorMessage: 'The name must start with "locations/"',
						},
					},
				],
				placeholder: 'locations/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchLocations',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Review Name',
		name: 'reviewName',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'Select the review by name or URL to retrieve its details',
		displayOptions: { show: { resource: ['review'], operation: ['get'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'reviews/[0-9]+',
							errorMessage: 'The name must start with "reviews/"',
						},
					},
				],
				placeholder: 'reviews/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchReviews',
					searchable: true,
				},
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              review:delete                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account',
		name: 'account',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The Google My Business account name',
		displayOptions: { show: { resource: ['review'], operation: ['delete'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the account name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'accounts/[0-9]+',
							errorMessage: 'The name must start with "accounts/"',
						},
					},
				],
				placeholder: 'accounts/012345678901234567890',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchAccounts',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Location',
		name: 'location',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The specific location or business associated with the account',
		displayOptions: { show: { resource: ['review'], operation: ['delete'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'locations/[0-9]+',
							errorMessage: 'The name must start with "locations/"',
						},
					},
				],
				placeholder: 'locations/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchLocations',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Review Name',
		name: 'reviewName',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'Select the review by name or URL to retrieve its details',
		displayOptions: { show: { resource: ['review'], operation: ['delete'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'reviews/[0-9]+',
							errorMessage: 'The name must start with "reviews/"',
						},
					},
				],
				placeholder: 'reviews/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchReviews',
					searchable: true,
				},
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                 review:getAll                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account',
		name: 'account',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The Google My Business account name',
		displayOptions: { show: { resource: ['review'], operation: ['getAll'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the account name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'accounts/[0-9]+',
							errorMessage: 'The name must start with "accounts/"',
						},
					},
				],
				placeholder: 'accounts/012345678901234567890',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchAccounts',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Location',
		name: 'location',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The specific location or business associated with the account',
		displayOptions: { show: { resource: ['review'], operation: ['getAll'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'locations/[0-9]+',
							errorMessage: 'The name must start with "locations/"',
						},
					},
				],
				placeholder: 'locations/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchLocations',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		required: true,
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 20,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: ['review'], operation: ['getAll'] } },
	},

	/* -------------------------------------------------------------------------- */
	/*                                 review:reply                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account',
		name: 'account',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The Google My Business account name',
		displayOptions: { show: { resource: ['review'], operation: ['reply'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the account name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'accounts/[0-9]+',
							errorMessage: 'The name must start with "accounts/"',
						},
					},
				],
				placeholder: 'accounts/012345678901234567890',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchAccounts',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Location',
		name: 'location',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'The specific location or business associated with the account',
		displayOptions: { show: { resource: ['review'], operation: ['reply'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'locations/[0-9]+',
							errorMessage: 'The name must start with "locations/"',
						},
					},
				],
				placeholder: 'locations/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchLocations',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Review Name',
		name: 'reviewName',
		required: true,
		type: 'resourceLocator',
		default: '',
		description: 'Select the review by name or URL to retrieve its details',
		displayOptions: { show: { resource: ['review'], operation: ['reply'] } },
		modes: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				hint: 'Enter the location name',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: 'reviews/[0-9]+',
							errorMessage: 'The name must start with "reviews/"',
						},
					},
				],
				placeholder: 'reviews/012345678901234567',
			},
			{
				displayName: 'List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchReviews',
					searchable: true,
				},
			},
		],
	},
	{
		displayName: 'Reply',
		name: 'reply',
		type: 'string',
		default: '',
		description: 'The body of the reply (up to 4096 characters)',
		displayOptions: { show: { resource: ['review'], operation: ['reply'] } },
		typeOptions: { rows: 5 },
		routing: { send: { type: 'body', property: 'comment' } },
	},
];
