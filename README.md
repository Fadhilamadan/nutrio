# Nutrio

AI food macro tracking with private transient image analysis.

Snap a photo of your meal, and Nutrio uses AI to estimate calories, protein,
carbs, and fat. Everything is stored in Notion — no traditional database,
no permanent food photos.

## Features

- **AI analysis** — Identify macros from a photo using Gemini, Groq,
  OpenRouter, HuggingFace, or Mistral
- **Notion backend** — All data lives in your own Notion workspace
- **Privacy-first** — Images are analyzed in-transit, never stored
- **Daily targets** — Set calorie and macro goals with a built-in TDEE
  calculator
- **Reminders** — Browser notifications when it's time to log
- **PWA** — Installable on mobile and desktop
- **Dark/light mode** — Follows system or manual toggle
- **Google sign-in** — Simple auth with your Google account

## How it works

1. Sign in with Google
2. Tap the camera button and snap a food photo
3. AI returns estimated macros (calories, protein, carbs, fat)
4. Review, edit, and save — the meal is stored in your Notion workspace
5. Track progress against daily targets on the dashboard

## Tech stack

- **Framework** — Next.js 16 (App Router)
- **UI** — React 19, Tailwind CSS 4, Framer Motion, Radix UI
- **Database** — Notion via the Notion SDK
- **Auth** — NextAuth with Google OAuth
- **AI** — Provider-agnostic adapter (Gemini, Groq, OpenRouter,
  HuggingFace, Mistral)

## Architecture

```
src/
├── app/             # App Router pages, API routes
│   ├── page.tsx     # Single-page app — renders AppShell
│   └── api/         # API routes (meals, settings, targets, analyze)
├── components/      # Reusable UI (layout, shared, ui)
├── features/        # Feature modules (analyze, auth, dashboard, ...)
├── lib/             # Utilities, types, AI adapters, Notion client
│   ├── ai/          # 5 AI providers + factory + prompt
│   └── notion/      # Notion data access layer
```

The app is a single-page PWA. All data flows through API routes to
Notion. AI analysis happens server-side via the configured provider.

## Prerequisites

- Node.js 20+
- A Notion workspace with the integration set up
- A Google Cloud project with OAuth 2.0 credentials

## Quick start

```bash
git clone <repo>
cd nutrio
npm install

cp .env.example .env
# Edit .env with your credentials (see below)

npm run dev
```

Open http://localhost:3000.

## Setup

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project, enable the People API
3. Under Credentials → Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:3000` to Authorized JavaScript origins
5. Add `http://localhost:3000/api/auth/callback/google` to
   Authorized redirect URIs
6. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`
7. Generate `AUTH_SECRET` with `openssl rand -base64 32`

### 2. Notion integration

1. Go to https://www.notion.so/profile/integrations
2. Create a new internal integration, copy the token to
   `NOTION_TOKEN` in `.env`
3. Create **4 databases** in your workspace (see schema below)
4. Share each database with your integration (top-right Share →
   Invite → select your integration)
5. Copy the database ID from the URL:
   `https://notion.so/workspace/<DB_ID>?v=...`

### Database schemas

| Database     | Properties                                                                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Users**    | `Name` (title), `UserID` (rich text), `Role` (select), `Email` (rich text), `Color` (rich text)                                                                  |
| **Meals**    | `MealName` (title), `UserID`, `Date`, `Calories`, `Protein`, `Carbs`, `Fat`, `ServingEstimate`, `FoodItems`, `Confidence`, `Notes`, `AIProvider`, `EditedByUser` |
| **Targets**  | `Name` (title), `UserID`, `DailyCalories`, `DailyProtein`, `DailyCarbs`, `DailyFat`, `ReminderTime`, `UpdatedAt`                                                 |
| **Settings** | `Name` (title), `UserID`, `AIProvider`, `AIModel`, `HasAPIKey`, `NotificationEnabled`, `PWAInstalled`, `Theme`                                                   |

Unlisted property types default to rich text. See the PRD for the full
field specifications.

### 3. Environment variables

| Variable                    | Description                                 |
| --------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`       | Public URL (default: http://localhost:3000) |
| `AUTH_SECRET`               | NextAuth encryption secret                  |
| `AUTH_GOOGLE_ID`            | Google OAuth client ID                      |
| `AUTH_GOOGLE_SECRET`        | Google OAuth client secret                  |
| `NOTION_TOKEN`              | Notion internal integration token           |
| `NOTION_USERS_DB_ID`        | Users database ID                           |
| `NOTION_MEALS_DB_ID`        | Meals database ID                           |
| `NOTION_TARGETS_DB_ID`      | Targets database ID                         |
| `NOTION_SETTINGS_DB_ID`     | Settings database ID                        |
| `GEMINI_DEFAULT_MODEL`      | Default Gemini model                        |
| `GROQ_DEFAULT_MODEL`        | Default Groq model                          |
| `OPENROUTER_DEFAULT_MODEL`  | Default OpenRouter model                    |
| `HUGGINGFACE_DEFAULT_MODEL` | Default HuggingFace model                   |
| `MISTRAL_DEFAULT_MODEL`     | Default Mistral model                       |

## Usage

- **Dashboard** — View today's meals and progress toward targets
- **Analyze** — Tap the camera button, take a photo, review AI results
- **History** — Browse past meals, search, edit, or archive
- **Targets** — Set daily macro goals or use the built-in TDEE
  calculator
- **Settings** — Choose AI provider, configure API key, toggle theme
  and notifications

## AI providers

Each provider needs its own API key, configured in-app under Settings.

| Provider    | Get a key                                   |
| ----------- | ------------------------------------------- |
| Gemini      | https://aistudio.google.com                 |
| Groq        | https://console.groq.com                    |
| OpenRouter  | https://openrouter.ai (free tier available) |
| HuggingFace | https://huggingface.co/settings/tokens      |
| Mistral     | https://console.mistral.ai                  |

## Deployment

The app can be deployed to any Node.js platform (Vercel, Fly, Railway,
etc.). Make sure all environment variables are set in the production
environment.

## Contributing

PRs are welcome. Open an issue first to discuss changes, especially
for new features or provider integrations.

## License

MIT
