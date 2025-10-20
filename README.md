# ResMan Connector

NodeJS TypeScript connector for the ResMan API v2 - A simple and elegant way to interact with ResMan's property management platform.

> **Official API Documentation:** [ResMan Partners API Docs](https://partners-api-docs.myresman.com/#intro)
>
> ⚠️ **API Version Support:** This library supports **ResMan API v2 only**. ResMan API v1 endpoints are not supported.

## Installation

```bash
npm install resman-connector
```

or with yarn:

```bash
yarn add resman-connector
```

## Features

- 🚀 Simple and intuitive API
- 📘 Full TypeScript support with type definitions
- 🛡️ Built-in error handling
- ⚡ Promise-based (async/await)
- 🔄 Automatic request/response interceptors
- 🎯 Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ ResMan API v2 support (v1 endpoints not supported)

## Disclaimer

This is an **unofficial, third-party library** created to simplify integration with the ResMan API. This project is **not officially affiliated with, endorsed by, or maintained by ResMan, Inhabit, or any of their affiliates**.

- **ResMan** and related trademarks are property of their respective owners
- This is an independent, open-source project maintained by the community
- For official ResMan API support, please refer to the [ResMan Partners API Documentation](https://partners-api-docs.myresman.com/#intro)
  **No warranty or support is guaranteed** - this software is provided "as is" under the MIT License (please reference the LICENSE file for license information)
- **Use at your own risk** - the authors and contributors are not responsible for any issues arising from the use of this library

To become an official Integration Partner, please apply through ResMan's official channels.

## Quick Start

### Using ResManClient (Recommended)

The high-level client provides organized access to all ResMan API endpoints:

```typescript
import { ResManClient } from 'resman-connector';

// Initialize the client
const client = new ResManClient({
  integrationPartnerId: 'your-partner-id',
  apiKey: 'your-api-key',
  accountId: 'client-account-id',
});

// Use organized endpoint modules
async function example() {
  // Properties
  const properties = await client.properties.getProperties();
  console.log(properties.data);

  // Work Orders
  const workOrder = await client.workOrders.createWorkOrder({
    propertyId: 123,
    description: 'Leaking faucet',
    priority: 'High',
  });
  console.log(workOrder.data);

  // Units
  const units = await client.units.getUnits({ propertyId: '1' });
  console.log(units.data);
}
```

## Using TypeScript Types

All ResMan types and enums are available. Use these to ensure propery shape of your Resman Objects

```typescript
import { TWorkOrderResponse, WorkOrderStatus, WorkOrderPriority } from 'resman-connector';
```

## Configuration

### ResManConfig Options

| Option               | Type                   | Required | Description                                      |
| -------------------- | ---------------------- | -------- | ------------------------------------------------ |
| integrationPartnerId | string                 | Yes      | Integration Partner ID (provided by ResMan)      |
| apiKey               | string                 | Yes      | API Key (provided by ResMan)                     |
| accountId            | string                 | Yes      | ResMan Account ID (identifies client account)    |
| timeout              | number                 | No       | Request timeout in milliseconds (default: 30000) |
| headers              | Record<string, string> | No       | Custom headers to include in all requests        |

### Authentication

ResMan API uses **Basic Authentication** with the following requirements:

- **Username**: Integration Partner ID
- **Password**: API Key
- **Required Header**: `ResMan-Account-Id` (automatically added with every request)

The connector automatically handles authentication by:

1. Encoding your Integration Partner ID and API Key as Base64 for Basic Auth
2. Adding the `Authorization: Basic {credentials}` header to all requests
3. Including the `ResMan-Account-Id` header with your specified account ID

**Authentication Errors:**

- If credentials are missing, malformed, or invalid, the API returns **HTTP 401 Unauthorized**
- The connector throws a `ResManApiError` with status code 401 for authentication failures

**Request Methods:**

- **GET requests**: Parameters are sent in the query string
- **POST/PATCH requests**: Parameters are sent in the request body

To become an Integration Partner and obtain credentials, apply at the [ResMan Partners API Documentation](https://partners-api-docs.myresman.com/#intro).

## Error Handling

The connector handles errors gracefully and returns a consistent response shape. All API methods return a `TApiResponse<T>` type that is a discriminated union:

```typescript
type TApiResponse<T> =
  | { data: T; error: undefined } // Success case
  | { data: undefined; error: unknown }; // Error case
```

### Handling API Errors

To check if an API request failed, simply check for the existence of the `error` property:

```typescript
const response = await client.properties.getProperties();

if (response.error) {
  // Error case: response.data is undefined, response.error contains error details
  console.error('API Error:', response.error);
} else {
  // Success case: response.data contains the data, response.error is undefined
  console.log('Properties:', response.data);
}
```

The connector catches all API errors automatically - **you don't need try/catch blocks** for API calls.

### Configuration Errors

`ResManConfigError` is thrown when the connector configuration is invalid. These errors occur during initialization and **must be caught with try/catch**:

```typescript
try {
  const client = new ResManClient({
    integrationPartnerId: 'partner-id',
    apiKey: 'api-key',
    accountId: '', // ❌ Empty accountId will throw
  });
} catch (error) {
  if (error instanceof ResManConfigError) {
    console.error('Configuration Error:', error.message);
  }
}
```

### Error Types

| Error Type          | When It Occurs                       | How to Handle          |
| ------------------- | ------------------------------------ | ---------------------- |
| `ResManApiError`    | API request fails (network, 4xx/5xx) | Check `response.error` |
| `ResManConfigError` | Invalid configuration at init        | Use try/catch block    |

## Advanced Usage

### Updating Credentials

```typescript
// Update API credentials
client.updateCredentials('new-partner-id', 'new-api-key');

// Update account ID (switch to different client account)
client.updateAccountId('different-account-id');
```

### Getting Configuration

```typescript
const accountId = client.getAccountId();
```

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
