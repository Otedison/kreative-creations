import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiUrl = process.env.ZETU_PAY_API_URL;
  const secretKey = process.env.ZETU_PAY_SECRET_KEY || process.env.ZETU_PAY_API_KEY;

  if (!apiUrl || !secretKey) {
    return NextResponse.json({ error: "Zetu Pay is not configured on the server." }, { status: 503 });
  }
  if (apiUrl.includes("your-zetupay-api-host") || apiUrl.includes("PASTE_")) {
    return NextResponse.json({ error: "Replace ZETU_PAY_API_URL with the real ZetuPay API URL from the Developers portal." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const invoiceNumber = String(body.invoiceNumber || "").trim();
  const email = String(body.email || "").trim();
  const phoneNumber = String(body.phoneNumber || "").trim();
  const amount = Number(body.amount);
  if (!invoiceNumber || !email || !phoneNumber || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invoice number, amount, email, and phone number are required." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: invoiceNumber,
        amount,
        currency: "KES",
        phoneNumber,
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/pay/success/`,
        invoice_number: invoiceNumber,
        customer_email: email,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/payments/webhook`,
      }),
    });
  } catch (error) {
    console.error("ZetuPay request failed", error);
    return NextResponse.json({ error: "Could not connect to ZetuPay. Check ZETU_PAY_API_URL." }, { status: 502 });
  }

  const responseText = await response.text();
  let result: any = {};
  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch {
    result = { message: responseText.slice(0, 200) };
  }
  if (!response.ok) return NextResponse.json({ error: result.message || `ZetuPay rejected the payment request (${response.status}).` }, { status: 502 });

  const checkoutUrl = result.checkout_url || result.checkoutUrl || result.data?.checkout_url || result.data?.checkoutUrl;
  if (!checkoutUrl) return NextResponse.json({ error: "ZetuPay did not return a checkout URL." }, { status: 502 });
  return NextResponse.json({ checkoutUrl });
}