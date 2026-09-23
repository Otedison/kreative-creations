export const googleSheetsWebhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

export const contactFormAction = googleSheetsWebhookUrl || "https://formsubmit.co/d5f27201196224a39e1c37a29561b232";
export const enrollmentFormAction = googleSheetsWebhookUrl || "https://formsubmit.co/d5f27201196224a39e1c37a29561b232";

export async function submitToGoogleSheets(form: HTMLFormElement): Promise<void> {
	if (!googleSheetsWebhookUrl) return;

	const payload = new URLSearchParams();
	new FormData(form).forEach((value, key) => {
		if (typeof value === "string") payload.append(key, value);
	});

	await fetch(googleSheetsWebhookUrl, {
		method: "POST",
		mode: "no-cors",
		body: payload,
	});
}