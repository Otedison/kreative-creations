# Kreative Creations (maintained by `otedison`)

## Project info

**Repository**: https://github.com/Otedison/kreative-creations

**Maintainer**: `otedison` — feel free to open issues or PRs.

## How can I edit this code?

There are several ways of editing your application.

**Work locally or via GitHub**

This repository is maintained by `otedison` and contains the full source for this site. Changes should be made via GitHub; push branches and open PRs to land changes.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will be reflected on GitHub.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To publish, build and deploy to your hosting provider (Vercel/Netlify/Cloudflare Pages) following their deployment docs.

## Can I connect a custom domain?

Yes — connect a domain via your hosting provider's settings (Vercel/Netlify/Cloudflare). Refer to your hosting provider docs for domain setup and DNS instructions.

---

## Admin auth (local JWT) 🔒

This project uses a simple MongoDB + JWT-based admin login for local development. To sign in as admin:

1. Send POST /api/admin/login with JSON body { "password": "<ADMIN_PASSWORD>" } (the password is stored in `.env` as `ADMIN_PASSWORD`).
2. The response will include a `token`. Store it in localStorage as `admin_token` or send it in the `Authorization: Bearer <token>` header on admin API requests.

Note: Rotate `ADMIN_JWT_SECRET` and `ADMIN_PASSWORD` before deploying to production.

