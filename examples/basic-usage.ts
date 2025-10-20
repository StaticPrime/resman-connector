/**
 * Basic usage example for ResMan Connector
 *
 * This example demonstrates how to use the ResMan Connector
 * to interact with the ResMan API using the high-level client.
 */

import {
  ResManClient,
  ResManApiError,
  ResManConfigError,
  WorkOrderPriority,
  WorkOrderStatus,
} from '../src';

async function main() {
  try {
    // Initialize the ResMan client
    const client = new ResManClient({
      integrationPartnerId: process.env.RESMAN_PARTNER_ID || 'your-partner-id',
      apiKey: process.env.RESMAN_API_KEY || 'your-api-key',
      accountId: process.env.RESMAN_ACCOUNT_ID || 'client-account-id',
      timeout: 30000, // 30 seconds
    });

    console.log('✅ ResMan Client initialized successfully!');
    console.log('🔑 Account ID:', client.getAccountId());

    // ========================================
    // Example 1: GET Request - Fetch Properties
    // ========================================
    console.log('\n========================================');
    console.log('📥 GET Request - Fetch Properties');
    console.log('========================================');

    const properties = await client.properties.getProperties();
    console.log('Properties:', properties.data);

    // ========================================
    // Example 2: GET Request - Fetch Units
    // ========================================
    console.log('\n========================================');
    console.log('📥 GET Request - Fetch Units');
    console.log('========================================');

    const units = await client.units.getUnits({
      propertyId: properties.data?.[0]?.propertyId || '1',
    });
    console.log('Units:', units.data);

    // ========================================
    // Example 3: POST Request - Create Work Order
    // ========================================
    console.log('\n========================================');
    console.log('📤 POST Request - Create Work Order');
    console.log('========================================');

    const newWorkOrder = await client.workOrders.addWorkOrder({
      propertyId: properties.data?.[0]?.propertyId || '1',
      description: 'Leaking faucet in kitchen',
      priority: WorkOrderPriority.MEDIUM,
      categoryId: '1',
    });
    console.log('Created Work Order:', newWorkOrder.data);

    // ========================================
    // Example 4: PUT Request - Update Work Order
    // ========================================
    console.log('\n========================================');
    console.log('🔄 PUT Request - Update Work Order');
    console.log('========================================');

    if (newWorkOrder.data?.workOrderId) {
      const updatedWorkOrder = await client.workOrders.updateWorkOrder({
        propertyId: properties.data?.[0]?.propertyId || '1',
        workOrderId: newWorkOrder.data?.workOrderId,
        status: WorkOrderStatus.IN_PROGRESS,
        priority: WorkOrderPriority.HIGH,
      });
      console.log('Updated Work Order:', updatedWorkOrder.data);
    }

    console.log('\n✨ All examples completed successfully!');
  } catch (error) {
    // Handle specific error types
    if (error instanceof ResManConfigError) {
      console.error('\n❌ Configuration Error:');
      console.error('  Message:', error.message);
    } else if (error instanceof ResManApiError) {
      console.error('\n❌ API Error:');
      console.error('  Message:', error.message);
      console.error('  Status Code:', error.statusCode);
      console.error('  Error Code:', error.code);
      console.error('  Details:', error.details);
    } else {
      console.error('\n❌ Unexpected Error:', error);
    }
  }
}

// Run the example
main();
