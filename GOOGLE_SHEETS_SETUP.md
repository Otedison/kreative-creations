# Google Sheets form setup

1. Create or open the Google Sheet that should receive submissions.
2. Open **Extensions > Apps Script**.
3. Paste the contents of `scripts/google-sheets-webhook.gs` into the Apps Script editor.
4. Deploy it as a **Web app** with **Execute as: Me** and **Who has access: Anyone**.
5. Copy the deployed web-app URL into `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

6. Restart the Next.js server after changing `.env.local`.

The script creates `Contact submissions` and `Course enrollments` tabs automatically. If the environment variable is empty, the forms continue using the existing FormSubmit fallback.