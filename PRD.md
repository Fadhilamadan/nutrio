# Product Requirements Document (PRD)

# Nutrio — AI Food Macro Tracker

## 1. Product Summary

Nutrio is a mobile-first Progressive Web App (PWA) that allows users to track calories and macros by taking a picture of their food and analyzing it with AI.

The application supports multiple users, allowing each user to maintain their own nutrition goals, food history, and settings.

The primary goal is to create the fastest possible food logging experience while keeping infrastructure costs near zero by leveraging Notion as the primary database and avoiding image storage.

---

## 2. Product Vision

Most nutrition tracking apps require users to manually search foods, estimate portions, and enter nutritional values.

Nutrio simplifies this process by allowing users to:

1. Take a photo of food
2. Let AI estimate nutrition values
3. Review and edit the result
4. Save the meal
5. Track daily nutrition goals

The entire experience should be optimized for iPhone and Android users while remaining accessible from desktop browsers.

---

## 3. MVP Goals

The MVP should allow users to:

- Create an account
- Log in
- Take or upload food photos
- Analyze food using AI
- Edit AI results
- Save meal metadata
- Track calories and macros
- View historical meals
- Configure nutrition targets
- Receive reminders
- Manage personal AI provider settings

---

## 4. Target Users

### Primary Users

People who want to track nutrition quickly.

Examples:

- Fitness enthusiasts
- Diet-focused individuals

Each user should have independent:

- History
- Targets
- Settings
- Notifications

---

## 5. Core Problem

Current nutrition tracking apps require too much manual input.

Users want:

- Faster logging
- Less typing
- Automatic macro estimation
- Historical tracking
- Goal tracking

without the complexity of traditional calorie-counting applications.

---

# 6. Product Scope

## Included in MVP

### Authentication

- Google Login
- Multi-user support

### Food Logging

- Take photo
- Upload photo
- AI food analysis
- Manual correction with text helper

### Nutrition Tracking

- Calories
- Protein
- Carbohydrates
- Fat

### History

- Daily meal history
- Meal details
- Edit meal
- Delete meal
- Cursor pagination for large histories
- Server-side search across meal metadata and date-like queries

### Goals

- Daily calorie target
- Daily protein target
- Daily carb target
- Daily fat target
- Metric TDEE calculator for suggested targets

### Notifications

- Daily reminders
- Nutrition progress reminders

### Settings

- AI provider & model selection (e.g., Gemini, Groq, OpenRouter, Hugging Face, Mistral)
- Dynamic API key management
- Notification settings
- Theme preference

### PWA Support

- Add to Home Screen
- Mobile optimized

---

## Excluded from MVP

- WhatsApp integration
- Telegram integration
- Barcode scanning
- Nutrition database search
- Subscription system
- Social features
- Family dashboards
- Wearable integrations

---

# 7. Recommended Tech Stack

## Frontend

### Framework

```txt
Next.js 16
TypeScript
```

### UI

```txt
Tailwind CSS
shadcn/ui
Framer Motion
```

### Deployment

```txt
Vercel
```

---

## Authentication

### Recommended

```txt
Auth.js (NextAuth)
```

Providers:

- Google Login

No password-based authentication required. The MVP uses Google Login only.

---

## Database

### Primary Database

```txt
Notion API
```

Notion will be used to store:

- Users
- Meals
- Targets
- Settings

No additional database is required for MVP.

---

## AI Providers

### Philosophy

Nutrio does not bundle or subsidize AI API costs. Users bring their own API keys
and choose the provider and model that best fits their needs — including free-tier
models where available. This keeps infrastructure costs near zero and gives users
full control over their AI provider.

### Supported Providers (MVP)

```txt
Gemini (Google)   — Best free tier for vision. Gemini 2.5 Flash: 1,500 req/day,
                    no credit card required. Permanent free access.
Groq              — Fast free inference on custom LPU hardware. Llama 4 / Pixtral
                    vision models. 14,400 req/day free tier.
OpenRouter        — Unified gateway routing to many free models via openrouter/free.
                    Single API key to access multiple providers.
Hugging Face      — Free Inference API with many open-source vision models.
                    Rate-limited, no credit card required.
Mistral AI        — Free tier includes Pixtral vision model. 1B tokens/month,
                    5 RPM rate limit.
```

### Default Model

No default is hard-coded. Users select their provider and model during initial
setup. The last-used provider and model are persisted per user for convenience.

### Free Model Considerations

"Free" refers to rate-limited or free-tier models offered by each provider.
Availability, rate limits, and model quality vary by provider and are outside
Nutrio's control.

---

# 8. Image Handling Strategy

## Important Requirement

Food images should NOT be permanently stored.

Images are only used for AI analysis.

Images may be compressed and sent transiently to the configured AI provider. Images must not be saved to Notion or permanent application storage.

---

## Workflow

```txt
Take Photo
      ↓
Compress Image
      ↓
Send to AI
      ↓
Receive Nutrition Analysis
      ↓
User Reviews Result
      ↓
Save Metadata to Notion
      ↓
Discard Image
```

---

## Benefits

- No image storage costs
- Avoids Notion file limits
- Faster database operations
- Lower hosting costs
- Simpler privacy management

---

# 9. Image Compression Requirements

Before AI analysis:

### Format

```txt
WebP
```

### Quality

```txt
70%
```

### Maximum Width

```txt
1280px
```

### Recommended Library

```txt
browser-image-compression
```

or

```txt
sharp
```

---

# 10. Database Design

## Database 1: Users

### Purpose

Store user profiles.

### Fields

| Property  | Type     |
| --------- | -------- |
| Name      | Title    |
| Email     | Email    |
| UserID    | Text     |
| CreatedAt | Date     |
| Role      | Select   |
| Active    | Checkbox |

---

## Database 2: Meals

### Purpose

Store nutrition history.

### Fields

| Property        | Type     |
| --------------- | -------- |
| MealName        | Title    |
| UserID          | Text     |
| Date            | Date     |
| Calories        | Number   |
| Protein         | Number   |
| Carbs           | Number   |
| Fat             | Number   |
| ServingEstimate | Text     |
| FoodItems       | Text     |
| Confidence      | Number   |
| Notes           | Text     |
| AIProvider      | Select   |
| EditedByUser    | Checkbox |

---

## Database 3: Targets

### Purpose

Store nutrition goals.

### Fields

| Property      | Type   |
| ------------- | ------ |
| Name          | Title  |
| UserID        | Text   |
| DailyCalories | Number |
| DailyProtein  | Number |
| DailyCarbs    | Number |
| DailyFat      | Number |
| ReminderTime  | Text   |
| UpdatedAt     | Date   |

---

## Database 4: Settings

### Purpose

Store application preferences.

### Fields

| Property            | Type     |
| ------------------- | -------- |
| Name                | Title    |
| UserID              | Text     |
| AIProvider          | Select   |
| AIModel             | Text     |
| HasAPIKey           | Checkbox |
| NotificationEnabled | Checkbox |
| PWAInstalled        | Checkbox |
| Theme               | Select   |

---

# 11. AI API Key Management

## Requirement

Users should be able to switch providers and replace API keys at any time.

### Settings Fields

- AI Provider
- AI Model
- API Key

---

## Security

For MVP:

API keys should be stored locally in browser storage.

Notion should not store raw API keys.

---

# 12. API Requirements

## Analyze Food

### Endpoint

```txt
POST /api/analyze-food
```

### Input

```json
{
  "imageBase64": "string",
  "provider": "openrouter",
  "apiKey": "user_api_key"
}
```

### Output

```json
{
  "mealName": "Chicken Rice Bowl",
  "items": ["Chicken", "Rice", "Vegetables"],
  "calories": 620,
  "protein": 42,
  "carbs": 68,
  "fat": 18,
  "confidence": 0.76,
  "notes": "Estimated from image"
}
```

---

## Save Meal

### Endpoint

```txt
POST /api/meals
```

Stores metadata in Notion.

---

## Get Meals

### Endpoint

```txt
GET /api/meals
```

Parameters:

```txt
date
limit
cursor
query
```

Response:

```json
{
  "items": [],
  "nextCursor": "string | null",
  "hasMore": true
}
```

History lists must use cursor pagination and must not render an unbounded list of meals. Search must reset pagination and query the server so users with large histories can search beyond the currently loaded page.

---

## Update Meal

### Endpoint

```txt
PATCH /api/meals/:id
```

---

## Delete Meal

### Endpoint

```txt
DELETE /api/meals/:id
```

Delete behavior:

```txt
Show confirmation
    ↓
Archive Notion Page
```

instead of permanent deletion.

---

# 13. User Flow

## Log Meal Flow

```txt
Dashboard
    ↓
Analyze Food
    ↓
Take Photo
    ↓
Compress Image
    ↓
AI Analysis
    ↓
Review Results
    ↓
Save Meal
    ↓
Dashboard Updated
```

---

## Daily Tracking Flow

```txt
Open App
    ↓
View Progress
    ↓
Log Meals
    ↓
Review History
    ↓
Receive Reminder
```

---

# 14. Application Screens

## Screen 0: Landing Page

A marketing page shown to unauthenticated users before login.

Features:

- Hero section with value proposition ("AI macros for every plate")
- "What is Nutrio" — explains the product (AI food photo analysis, Notion storage)
- "Why it matters" — 3 pillars: awareness, effortlessness, privacy
- "How it works" — 3-step flow: snap, analyze, save
- CTA section with Google sign-in button

The landing page is skipped for returning users with an active session.

---

## Screen 1: Login

Features:

- Google Login

---

## Screen 2: Today Dashboard

Features:

- Daily calories
- Protein progress
- Carbs progress
- Fat progress
- Remaining macros
- Recent meals
- Floating Analyze button

Empty State:

- If no meals are logged for the current day, show a calm empty state in the Recent Meals section
- Empty state should explain that no meals have been logged today
- Empty state should guide users to use the floating Analyze button to scan their first meal
- Daily progress should still render with zero values against configured targets
- If targets are not configured, show a setup prompt explaining that progress becomes meaningful after target setup

---

## Screen 3: Analyze Food

Features:

- Camera capture
- Upload image
- AI loading state
- Editable results
- Save meal

---

## Screen 4: History

Features:

- Meals grouped by date
- Daily totals
- Search
- Search result count
- Clear search action
- Cursor pagination with a Load More action
- No-result search state
- Edit
- Archive with confirmation
- Inline edit form adjacent to the selected meal

Date Format:

- History group dates must display as `DD MMM YYYY`, for example `12 Apr 2026`
- Stored Notion dates remain native Notion date values; display formatting is presentation-only

Pagination:

- The first page should load a bounded number of meals
- If more meals exist, show a `Load more meals` action
- Loading more appends the next page without duplicating already loaded meals
- Search resets pagination and runs server-side across meal name, serving estimate, food items, notes, and date-like queries
- Editing a meal opens an inline form directly below the selected meal so users keep context on long histories

Empty State:

- If the user has no saved meals, show a full history empty state
- Empty state should explain that nutrition history will appear after meals are saved
- Empty state should reinforce that only nutrition metadata is stored, not food images

---

## Screen 5: Targets

Features:

- Calories target
- Protein target
- Carb target
- Fat target
- Metric TDEE calculator
- Reminder time

Target calculator inputs:

- Age
- Sex
- Height in centimeters
- Weight in kilograms
- Activity level
- Goal

Calculator inputs are transient client-side values and must not be saved to Notion. Only final target values are persisted.

---

## Screen 6: Settings

Features:

- OpenRouter model
- AI Model
- API Key
- Notifications
- PWA Settings

---

## Screen 7: Profile

Features:

- Name
- Email
- Logout

---

# 15. Notifications

## MVP Notifications

Support:

- Browser notifications
- PWA notifications

Examples:

```txt
Did you log your lunch?
```

```txt
You still need 25g of protein today.
```

---

## Requirement

Users must be able to:

- Enable notifications
- Disable notifications
- Configure reminder time

---

# 16. UI / UX Direction

## Design Principles

- Mobile-first
- iPhone optimized
- One-handed usage
- Minimal typing
- Fast interactions
- Clear loading feedback for session, Notion data, and AI analysis

---

## Visual Style

- Dark mode first
- Premium health-tech design
- Glassmorphism cards
- Rounded corners
- Smooth animations
- Large touch targets
- Bottom navigation
- Floating action button
- Theme preference should visibly update app surfaces and text

---

## Animations

Use Framer Motion for:

- Page transitions
- Loading states
- Success states
- Macro progress updates
- Bottom sheets

---

# 17. MVP Success Criteria

The MVP is successful when:

- Users can log in
- Users can upload food photos
- AI can estimate macros
- Users can edit results
- Meals are saved to Notion
- Daily progress is calculated correctly
- Targets are configurable
- Notifications work
- The app functions smoothly as an iPhone PWA
