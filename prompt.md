let us give it a defined price 
if the originality score is >6 then add $5 dollars to the price, if the use-case value score is >6 then add $5 dollars to the price thereby making the price %10 total

use this scale 7 to 10 then let it be $5; 4 to 6 then let it be $3; 1 to 3 then let it $1.  then add up the price for originality and use case value. max an idea can cost is $10 and least is $2.


///// then let us integrate the sidshif api, rmember any .env variable needed should be added to the env.sample, if theres any thing you need me to go get or set up, let me know

SideShift Pay Integration Guide
This guide will help you integrate our Stripe-like crypto payment solution into your webshop. Follow the steps below to create checkouts, redirect users for payment, and receive payment notifications via webhooks.

Introduction
SideShift Pay offers a simple and seamless way to accept cryptocurrency payments in your webshop. By integrating our checkout feature, you can allow your customers to pay with any supported cryptocurrency, while you receive settlements in the coin of your choice.

Prerequisites
SideShift.ai Account: Ensure you have an active SideShift.ai account.
Account ID and Private Key:
Account ID: Your unique identifier on SideShift.ai. It can also be used as the affiliateId to receive commissions.
Private Key: Your API secret key used for authentication.
Both can be acquired from https://sideshift.ai/account.
Affiliate ID: The Account ID of the account that should receive the commission. It can be your own Account ID or any other Account ID.
Web Server: Your webshop should be able to handle HTTP requests and responses.
Creating a Checkout
To create a new checkout, make a POST request to the /v2/checkout endpoint with the necessary parameters. This will set up the payment details where you (the merchant) specify your settlement preferences.

Endpoint
POST https://sideshift.ai/api/v2/checkout

Request Headers
Content-Type: application/json
Accept: application/json
x-sideshift-secret: YOUR_PRIVATE_KEY
x-user-ip: END_USER_IP_ADDRESS (IP address of the customer initiating the checkout)
Request Body Parameters
settleCoin (string, required): The coin you want to receive (e.g., "BTC", "ETH").
settleNetwork (string, required): The network of the settle coin (e.g., "mainnet").
settleAmount (string, required): The amount you expect to receive.
settleAddress (string, required): Your wallet address where the settlement will be sent.
settleMemo (string, optional): Required if the coin uses a memo/tag.
affiliateId (string, required): The Account ID of the account that should receive the commission. This can be your own Account ID or any other Account ID.
successUrl (string, required): URL to redirect the user after a successful payment.
cancelUrl (string, required): URL to redirect the user if the payment is cancelled.
Example Request
curl --request POST \
  --url 'https://sideshift.ai/api/v2/checkout' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'x-sideshift-secret: YOUR_PRIVATE_KEY' \
  --header 'x-user-ip: END_USER_IP_ADDRESS' \
  --data '{
    "settleCoin": "ETH",
    "settleNetwork": "mainnet",
    "settleAmount": "0.01",
    "settleAddress": "YOUR_ETH_ADDRESS",
    "affiliateId": "YOUR_ACCOUNT_ID",
    "successUrl": "https://yourwebshop.com/success",
    "cancelUrl": "https://yourwebshop.com/cancel"
  }'

Successful Response
A successful response will return a JSON object containing the checkout details, including a unique id for the checkout.

{
  "id": "uniqueCheckoutID",
  "settleCoin": "ETH",
  "settleNetwork": "mainnet",
  "settleAddress": "YOUR_ETH_ADDRESS",
  "settleAmount": "0.01",
  "updatedAt": "2025-11-05T17:00:13.927000000Z",
  "createdAt": "2025-11-05T17:00:13.927000000Z",
  "affiliateId": "YOUR_ACCOUNT_ID",
  "successUrl": "https://yourwebshop.com/success",
  "cancelUrl": "https://yourwebshop.com/cancel",
}

Redirecting Users to the Payment Page
After creating the checkout, redirect your customers to the SideShift Pay payment page where they can complete the payment. Customers can choose any of the supported cryptocurrencies to pay with.

Payment URL Format
https://pay.sideshift.ai/checkout/{uniqueCheckoutID}

Replace {uniqueCheckoutID} with the id returned from the checkout creation response.

Setting Up Webhooks
To be notified when a payment is either success or fail, you need to set up a webhook. SideShift.ai will send a POST request to your specified targetUrl whenever there is an update on the checkout.

note
Currently, webhooks are set up via a GraphQL mutation. A UI-based setup will be available in the future.

Creating a Webhook
Make a POST request to the GraphQL endpoint to create a webhook.

Endpoint
POST https://sideshift.ai/graphql

Request Headers
Content-Type: application/json
x-sideshift-secret: YOUR_PRIVATE_KEY
Request Body
Use the following GraphQL mutation to create a webhook:

{
  "query": "mutation { createHook(targetUrl: \"https://yourwebshop.com/api/webhooks/sideshift\") { id createdAt updatedAt targetUrl enabled } }"
}


Example Request
curl --request POST \
  --url 'https://sideshift.ai/graphql' \
  --header 'Content-Type: application/json' \
  --header 'x-sideshift-secret: YOUR_PRIVATE_KEY' \
  --data '{"query":"mutation { createHook(targetUrl: \"https://yourwebshop.com/api/webhooks/sideshift\") { id createdAt updatedAt targetUrl enabled } }"}'


Successful Response
The response will include details of the created webhook.

{
  "data": {
    "createHook": {
      "id": "uniqueHookID",
      "createdAt": "2025-11-05T17:00:13.927000000Z",
      "updatedAt": "2025-11-05T17:00:13.927000000Z",
      "targetUrl": "https://yourwebshop.com/api/webhooks/sideshift",
      "enabled": true
    }
  }
}

Handling Webhook Notifications
Your server should handle incoming POST requests to the targetUrl. The notifications will include details about the checkout and its status.

Example Notification Payload
{
  "meta": {
    "hook": {
      "id": "webhookUniqueId",
      "createdAt": "2025-11-05T17:00:13.927000000Z",
      "updatedAt": "2025-11-05T17:00:13.927000000Z",
      "enabled": true,
      "accountId": "YourAccountId",
      "targetUrl": "YourWebhookUrl"
    }
  },
  "payload": {
    "shiftId": "ShiftId",
    "status": "success",
    "txid": "txHash"
  }
}

Status Values
success: Payment has been settled
fail: Payment ended unsuccessfully (refunded)
Sample Code
Creating a Checkout
// Create a checkout session
const response = await fetch('https://sideshift.ai/api/v2/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-sideshift-secret': 'YOUR_SECRET_KEY',
    'x-user-ip': customerIpAddress
  },
  body: JSON.stringify({
    settleCoin: 'BTC',
    settleNetwork: 'mainnet',
    settleAmount: '0.001',
    settleAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    affiliateId: 'YOUR_ACCOUNT_ID',
    successUrl: 'https://yourwebshop.com/success',
    cancelUrl: 'https://yourwebshop.com/cancel'
  })
});

const checkout = await response.json();
// Redirect customer to: https://pay.sideshift.ai/checkout/${checkout.id}

Handling Webhook Notifications
// Handle webhook notifications
app.post('/webhooks/sideshift', (req, res) => {
  const { meta, payload } = req.body;
  const { shiftId, status, txid } = payload ?? {};

  console.log('Webhook meta:', meta);
  console.log('Webhook payload:', payload);

  switch (status) {
    case 'success':
      console.log(`Shift ${shiftId} succeeded with txid ${txid}`);
      break;
    case 'fail':
      console.log(`Shift ${shiftId} failed`);
      break;
  }

  res.status(200).send('OK');
});

Checking Order Status
You can use the /v2/checkout/{checkoutId} endpoint to fetch the latest checkout data, derive the latest shiftId from checkout.orders, and then query /v2/shifts/{shiftId} for the current shift status.

// Check latest shift/order status for a checkout
const checkoutResponse = await fetch(`https://sideshift.ai/api/v2/checkout/${checkoutId}`);

const checkout = await checkoutResponse.json();
console.log('Checkout:', checkout);

// Response example
// Checkout: {
//   id: 'fdebd5b5-357a-4cfd-b60b-076ae7c62d77',
//   settleCoin: 'BTC',
//   settleNetwork: 'mainnet',
//   settleAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
//   settleAmount: '0.001',
//   updatedAt: '2024-01-01T00:55:33.222000000Z',
//   createdAt: '2024-01-01T00:55:33.222000000Z',
//   affiliateId: 'YOUR_ACCOUNT_ID',
//   successUrl: 'https://yourwebshop.com/success',
//   cancelUrl: 'https://yourwebshop.com/cancel',
//   orders: [
//     {
//       id: 'd2a473f82603e9ccfbb8',
//       deposits: [
//         {
//           depositHash: '0x73b277e5df00f57a03cbe6ca318ca79e66398a2f3f9ff414966a7ec281e903c8',
//           settleHash: '055f7d293ebd4546b446da0eb920c5c427d72647ae58262e53b8a8a574544dd9'
//         }
//       ]
//     }
//   ]
// }

// The first order in checkout.orders (orders[0]) is the latest shift/order for this checkout
const shiftId = checkout.orders?.[0]?.id;
if (!shiftId) {
  throw new Error('No shiftId found');
}

// Fetch the shift to get the status
const shiftResponse = await fetch(`https://sideshift.ai/api/v2/shifts/${shiftId}`);

const shift = await shiftResponse.json();
console.log('Latest order status:', shift.status);

// Response example
// Latest order status: settled