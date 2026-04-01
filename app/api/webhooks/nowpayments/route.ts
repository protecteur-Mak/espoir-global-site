import { NextResponse } from "next/server";
import { NOWPAYMENTS_API_KEY } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-nowpayments-sig");
    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const body = await req.json();

    // Verify the payment status
    const response = await fetch(
      `https://api.nowpayments.io/v1/payment/${body.payment_id}`,
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing NOWPayments webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
