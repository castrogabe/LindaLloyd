const { Client, Environment } = require('square');

async function main() {
  const client = new Client({
    environment: Environment.Sandbox,
    accessToken:
      'EAAAlyYa4StbM0DfXqTUAEqnzj_JknKNTl5na4sBEapeaBSbR0bHEySbNlDKPe1M',
  });

  await client.ordersApi.createOrder({
    idempotencyKey: 'e75bfc21-a8b3-4e0f-91aa-1ccf1ef6b987',
    order: {
      locationId: 'LQHTMFDZTHCK7',
      taxes: [
        {
          uid: 'tax-1',
          name: 'Sales Tax',
          percentage: '9.5',
          type: 'ADDITIVE',
          scope: 'LINE_ITEM',
        },
      ],
      lineItems: [
        {
          name: 'Catalog Tax Test Item',
          quantity: '1',
          basePriceMoney: {
            amount: 2000,
            currency: 'USD',
          },
          appliedTaxes: [
            {
              taxUid: 'tax-1',
            },
          ],
        },
      ],
    },
  });

  console.log('Order created.');
}

main().catch((err) => {
  console.error('Error creating order:', err);
});

// run with <- node sandboxCatalogTaxOrder.js
