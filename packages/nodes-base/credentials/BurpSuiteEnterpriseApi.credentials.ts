import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BurpSuiteEnterpriseApi implements ICredentialType {
	name = 'burpSuiteEnterpriseApi';

	displayName = 'Burp Suite Enterprise API';

	documentationUrl =
		'https://portswigger.net/burp/documentation/enterprise/user-guide/api-documentation/api-overview';

	icon: Icon = 'file:icons/BurpSuite.svg';

	httpRequestNode = {
		name: 'BurpSuiteEnterprise',
		docsUrl:
			'https://portswigger.net/burp/documentation/enterprise/user-guide/api-documentation/api-overview',
		apiBaseUrl: '',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}'.replace(/\/$/, ''),
			url: '/graphql/v1',
			method: 'POST',
		},
	};
}
