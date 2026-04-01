import { NOWPAYMENTS_API_KEY } from "@/lib/constants";

const NOWPAYMENTS_API_URL = "https://api.nowpayments.io/v1";

interface CreatePaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  expiration_estimate_date: string;
  purchase_id: string;
}

export async function createPayment(
  amount: number,
  pay_currency: string,
  orderId: string
) {
  try {
    // Get the base URL from environment variable or use a default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Ensure the base URL doesn't end with a slash
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
      method: "POST",
      headers: {
        "x-api-key": NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usdttrc20",
        pay_currency: pay_currency,
        is_fee_paid_by_user: false,
        order_id: orderId,
        order_description: `Top-up of ${amount} USDT`,
        ipn_callback_url: `${cleanBaseUrl}/api/webhooks/nowpayments`,
        success_url: `${cleanBaseUrl}/dashboard/wallet?status=success`,
        cancel_url: `${cleanBaseUrl}/dashboard/wallet?status=cancelled`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create payment");
    }

    return (await response.json()) as CreatePaymentResponse;
  } catch (error) {
    console.error("Error creating NOWPayments payment:", error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await fetch(
      `${NOWPAYMENTS_API_URL}/payment/${paymentId}`,
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw error;
  }
}
