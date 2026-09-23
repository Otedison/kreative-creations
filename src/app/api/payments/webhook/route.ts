import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const event = JSON.parse(rawBody);
  console.info("Zetu Pay payment webhook received", { event: event.event || event.status, invoiceNumber: event.invoice_number || event.data?.invoice_number });
  return NextResponse.json({ received: true });
}