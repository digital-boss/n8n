import type { IHttpRequestOptions } from 'n8n-workflow';
import { presendFields } from '../GenericFunctions';

describe('presendFields', () => {
	let mockContext: any;
	let requestOptions: IHttpRequestOptions;

	beforeEach(() => {
		mockContext = {
			getNodeParameter: jest.fn(),
		};
		requestOptions = {
			url: 'https://example.com/api',
			headers: {},
		};
	});

	test('should add PathPrefix for ListUsers operation', async () => {
		// Mock the return value for getNodeParameter
		mockContext.getNodeParameter.mockReturnValueOnce({ PathPrefix: 'test' }); // additionalFields
		mockContext.getNodeParameter.mockReturnValueOnce(undefined); // options

		requestOptions.url = 'https://example.com/ListUsers';

		const result = await presendFields.call(mockContext, requestOptions);

		expect(result.url).toBe('https://example.com/ListUsers&PathPrefix=test');
	});

	test('should append user details for CreateUser operation', async () => {
		const additionalFields = {};
		const options = {
			PermissionsBoundary: 'boundary',
			Path: '/somepath',
			Tags: { tags: [{ key: 'key1', value: 'value1' }] },
		};

		mockContext.getNodeParameter.mockReturnValueOnce(additionalFields); // additionalFields
		mockContext.getNodeParameter.mockReturnValueOnce(options); // options
		mockContext.getNodeParameter.mockReturnValueOnce('username'); // UserName

		requestOptions.url = 'https://example.com/CreateUser';

		const result = await presendFields.call(mockContext, requestOptions);

		expect(result.url).toContain('&UserName=username');
		expect(result.url).toContain('&PermissionsBoundary=boundary');
		expect(result.url).toContain('&Path=/somepath');
		expect(result.url).toContain('&Tags.member.1.Key=key1');
		expect(result.url).toContain('&Tags.member.1.Value=value1');
	});

	test('should throw error if options are missing for UpdateUser operation', async () => {
		mockContext.getNodeParameter.mockReturnValueOnce(''); // options
		mockContext.getNodeParameter.mockReturnValueOnce({ value: 'username' }); // UserName mock value

		requestOptions.url = 'https://example.com/UpdateUser';

		await expect(presendFields.call(mockContext, requestOptions)).rejects.toThrowError(
			'At least one of the options (NewUserName or NewPath) must be provided to update the user.',
		);
	});

	test('should add GroupName for AddUserToGroup operation', async () => {
		mockContext.getNodeParameter.mockReturnValueOnce(undefined); // additionalFields
		mockContext.getNodeParameter.mockReturnValueOnce(undefined); // options
		mockContext.getNodeParameter.mockReturnValueOnce({ value: 'user1' }); // UserName
		mockContext.getNodeParameter.mockReturnValueOnce({ value: 'group1' }); // GroupName mock value

		requestOptions.url = 'https://example.com/AddUserToGroup';

		const result = await presendFields.call(mockContext, requestOptions);

		expect(result.url).toContain('&UserName=user1');
		expect(result.url).toContain('&GroupName=group1');
	});

	test('should append NewGroupName and NewPath for UpdateGroup operation', async () => {
		const options = {
			NewGroupName: 'newGroup',
			NewPath: '/newpath',
		};

		mockContext.getNodeParameter.mockReturnValueOnce(undefined); // additionalFields
		mockContext.getNodeParameter.mockReturnValueOnce(options); // options
		mockContext.getNodeParameter.mockReturnValueOnce({ value: 'group1' }); // GroupName

		requestOptions.url = 'https://example.com/UpdateGroup';

		const result = await presendFields.call(mockContext, requestOptions);

		expect(result.url).toContain('&GroupName=group1');
		expect(result.url).toContain('&NewGroupName=newGroup');
		expect(result.url).toContain('&NewPath=/newpath');
	});

	test('should add Path for CreateGroup operation', async () => {
		const options = { Path: '/newpath' };
		mockContext.getNodeParameter.mockReturnValueOnce(options); // options
		mockContext.getNodeParameter.mockReturnValueOnce({ value: 'group1' }); // GroupName mock value

		requestOptions.url = 'https://example.com/CreateGroup';

		const result = await presendFields.call(mockContext, requestOptions);

		expect(result.url).toContain('&GroupName=group1');
		expect(result.url).toContain('&Path=/newpath');
	});
});