# Software Requirements Specification (SRS)

# Nutrio - AI Food Macro Tracker

## 1. Introduction

This Software Requirements Specification defines the functional, technical, architectural, and quality requirements for Nutrio, a mobile-first Progressive Web App for AI-assisted food macro tracking.

The PRD describes the product goals and user value. This SRS describes the expected system behavior, boundaries, data contracts, and engineering structure required to implement and maintain the product.

## 2. System Overview

Nutrio allows authenticated users to log meals by taking or uploading a food photo, sending the image transiently to an AI provider, reviewing the estimated nutrition result, and saving only nutrition metadata to Notion.

The system must prioritize:

- Fast food logging
- Mobile-first and iPhone-optimized interaction
- Multi-user support
- Low infrastructure cost
- No permanent food image storage
- User-managed AI provider configuration
- Clear separation between product domains and reusable design-system UI

## 3. User Roles

### 3.1 Authenticated User

An authenticated user can:

- View today's nutrition progress
- Analyze food from a photo or uploaded image
- Review and edit AI-generated nutrition estimates
- Save meals
- View meal history
- Edit or delete saved meals
- Configure nutrition targets
- Configure AI provider settings
- Configure notification preferences
- View profile information

### 3.2 Unauthenticated Visitor

An unauthenticated visitor can:

- Access the login screen
- Start authentication using supported providers

Unauthenticated visitors must not access user-specific nutrition, settings, or meal data.

## 4. Functional Requirements

### 4.1 Authentication

- The system must support Google Login for MVP.
- The system must associate all user-owned records with a stable user identifier.
- The system must prevent users from accessing other users' meals, targets, and settings.

### 4.2 Today Dashboard

- The system must show daily calorie progress.
- The system must show daily protein, carbohydrate, and fat progress.
- The system must show remaining macro targets when targets are configured.
- The system must show recent meals for the selected day.
- The system must show an empty state when no meals are logged for the day.
- The system must keep daily progress visible even when all values are zero.
- The system must provide a prominent action for starting food analysis.

### 4.3 Food Analysis

- The system must allow users to take a photo on supported devices.
- The system must allow users to upload a food image.
- The system must compress images before AI analysis.
- The system must send images transiently to the configured AI provider.
- The system must return editable nutrition estimates to the user.
- The system must not save the analyzed image to Notion or permanent storage.

### 4.4 Meal Management

- The system must allow users to save reviewed meal metadata.
- The system must allow users to view saved meals.
- The system must allow users to edit saved meals.
- The system must require confirmation before archiving a meal.
- The system must allow users to archive meals by archiving the related Notion page.
- The system must calculate daily totals from saved meal metadata.

### 4.5 History

- The system must show meals grouped by date.
- The system must show daily nutrition totals.
- The system should support searching meal history.
- The system must show search result counts when filtering meal history.
- The system must provide a clear search action.
- The system must show a no-results state when a query matches no meals.
- The system must show an empty state when the user has no saved meals.
- The history empty state must reinforce that only metadata is stored, not food images.

### 4.6 Targets

- The system must allow users to configure daily calorie targets.
- The system must allow users to configure daily protein targets.
- The system must allow users to configure daily carbohydrate targets.
- The system must allow users to configure daily fat targets.
- The system must allow users to configure reminder time.
- The system must provide a metric TDEE calculator for suggested target values.
- The system must not persist TDEE calculator inputs.
- The system must persist only final target values after user review.

### 4.7 Settings

- The system must use OpenRouter as the only MVP AI provider.
- The system must allow users to configure an AI model.
- The system must allow users to replace their AI API key.
- The system must allow users to enable or disable notifications.
- The system must allow users to configure theme preference.
- Theme preference must visibly update supported app surfaces and text.
- The system must not store raw user AI API keys in Notion.

### 4.8 Notifications

- The system must support browser notifications where available.
- The system must support PWA notifications where available.
- The system must allow users to enable notifications.
- The system must allow users to disable notifications.
- The system must respect the configured reminder time.

### 4.9 PWA

- The system must provide a valid web app manifest.
- The system must support Add to Home Screen on supported devices.
- The system must be optimized for mobile viewport usage.
- The system should continue to render useful UI when installed as a PWA.

## 5. Non-Functional Requirements

### 5.1 Performance

- The primary meal logging flow must minimize steps and typing.
- The application must avoid unnecessary client-side JavaScript in route-level components.
- Heavy browser-only functionality, such as image compression and camera access, should remain isolated to client components.
- Independent server-side requests should be parallelized where possible.
- Shared imports must avoid broad barrel files that increase client bundle size.

### 5.2 Usability

- The interface must be mobile-first.
- Primary actions must be reachable in one-handed mobile usage.
- Touch targets must be large enough for mobile use.
- Empty states must explain what happened and guide the next action.
- Loading and success states must provide clear feedback.
- Loading states should use design-system surfaces, skeletons, and restrained motion rather than plain text.

### 5.3 Accessibility

- Interactive controls must have accessible labels.
- Text contrast must meet WCAG AA guidance.
- Forms must associate labels with inputs.
- Keyboard navigation must remain usable on desktop.
- Motion should respect reduced-motion preferences.

### 5.4 Reliability

- API failures must produce user-understandable error states.
- AI analysis failures must not save incomplete meals automatically.
- Notion persistence failures must not appear as successful saves.
- Archive operations must require confirmation and archive Notion pages rather than permanently deleting data.

### 5.5 Security And Privacy

- Raw food images must not be stored permanently.
- Raw user AI API keys must not be stored in Notion.
- User-owned data must be scoped by user identifier.
- Server routes must validate authorization before returning or mutating user data.
- Environment secrets must remain server-only.

## 6. Domain Model

The system should be organized around these business domains:

| Domain          | Responsibility                                       |
| --------------- | ---------------------------------------------------- |
| `auth`          | Login, session, authenticated user identity          |
| `users`         | User profile records and user lookup                 |
| `meals`         | Meal metadata, history, edits, deletion              |
| `nutrition`     | Macro calculations, daily totals, progress values    |
| `targets`       | Daily nutrition goals and reminder time              |
| `settings`      | AI provider, model, notifications, theme preferences |
| `ai-analysis`   | Image-to-nutrition request and response handling     |
| `notifications` | Browser/PWA notification preferences and reminders   |
| `pwa`           | Manifest, service worker, install behavior           |

Domain-specific components, schemas, actions, queries, and utilities should be colocated when the codebase grows enough to justify feature folders.

## 7. Data Requirements

### 7.1 Users

| Field       | Type     | Requirement                       |
| ----------- | -------- | --------------------------------- |
| `Name`      | Title    | Required                          |
| `Email`     | Email    | Required                          |
| `UserID`    | Text     | Required, stable, unique per user |
| `CreatedAt` | Date     | Required                          |
| `Role`      | Select   | Optional for MVP                  |
| `Active`    | Checkbox | Required                          |

### 7.2 Meals

| Field             | Type     | Requirement               |
| ----------------- | -------- | ------------------------- |
| `MealName`        | Title    | Required                  |
| `UserID`          | Text     | Required                  |
| `Date`            | Date     | Required                  |
| `Calories`        | Number   | Required                  |
| `Protein`         | Number   | Required                  |
| `Carbs`           | Number   | Required                  |
| `Fat`             | Number   | Required                  |
| `ServingEstimate` | Text     | Optional                  |
| `FoodItems`       | Text     | Optional                  |
| `Confidence`      | Number   | Optional                  |
| `Notes`           | Text     | Optional                  |
| `AIProvider`      | Select   | Required when AI was used |
| `EditedByUser`    | Checkbox | Required                  |

### 7.3 Targets

| Field           | Type   | Requirement |
| --------------- | ------ | ----------- |
| `Name`          | Title  | Required    |
| `UserID`        | Text   | Required    |
| `DailyCalories` | Number | Required    |
| `DailyProtein`  | Number | Required    |
| `DailyCarbs`    | Number | Required    |
| `DailyFat`      | Number | Required    |
| `ReminderTime`  | Text   | Optional    |
| `UpdatedAt`     | Date   | Required    |

### 7.4 Settings

| Field                 | Type     | Requirement |
| --------------------- | -------- | ----------- |
| `Name`                | Title    | Required    |
| `UserID`              | Text     | Required    |
| `AIProvider`          | Select   | Required    |
| `AIModel`             | Text     | Required    |
| `HasAPIKey`           | Checkbox | Required    |
| `NotificationEnabled` | Checkbox | Required    |
| `PWAInstalled`        | Checkbox | Optional    |
| `Theme`               | Select   | Required    |

## 8. API Requirements

### 8.1 `POST /api/analyze-food`

Input:

```json
{
  "imageBase64": "string",
  "provider": "openrouter",
  "apiKey": "user_api_key"
}
```

Output:

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

Requirements:

- The endpoint must accept compressed image data.
- The endpoint must support the configured AI provider.
- The endpoint must return structured nutrition estimates.
- The endpoint must not persist the source image.
- The endpoint must return a clear error when provider configuration is invalid.

### 8.2 `POST /api/meals`

- Must create a meal metadata record in Notion.
- Must scope the record to the authenticated user.
- Must reject missing or invalid macro values.

### 8.3 `GET /api/meals`

- Must return meals for the authenticated user.
- May filter by date.
- Must not return another user's meals.

### 8.4 `PATCH /api/meals/:id`

- Must update an existing meal owned by the authenticated user.
- Must reject updates to meals owned by another user.

### 8.5 `DELETE /api/meals/:id`

- Must require confirmation in the client before request submission.
- Must archive the Notion page for a meal owned by the authenticated user.
- Must not permanently delete the Notion page.

### 8.6 `GET/POST /api/targets`

- Must read and update nutrition targets for the authenticated user.
- Must preserve user ownership.

### 8.7 `GET/POST /api/settings`

- Must read and update settings for the authenticated user.
- Must store provider metadata without storing raw API keys in Notion.

### 8.8 `GET /api/users/me`

- Must create or return the authenticated user's profile metadata.
- Must avoid duplicate user records for the same stable user identifier.

## 9. Authentication Requirements

- Auth.js must be used for MVP authentication unless replaced by an explicit architecture decision.
- Google Login is the primary MVP provider.
- API routes that access user data must require an authenticated session.
- User identity must be resolved server-side before reading or mutating Notion data.

## 10. AI Analysis Requirements

- OpenRouter is the primary MVP AI provider.
- OpenRouter is the only supported MVP AI provider.
- The default AI model must be configurable.
- Free model availability depends on OpenRouter and upstream model provider limits.
- AI responses must be normalized into a stable meal analysis shape before the user reviews them.
- The user must be able to edit AI-generated values before saving.

## 11. Image Handling Requirements

- Images must be compressed before AI analysis.
- The preferred output format is WebP.
- The preferred quality setting is 70%.
- The maximum image width should be 1280px.
- Images may be sent transiently to an AI provider.
- Images must not be saved to Notion.
- Images must not be saved to permanent application storage.
- Any temporary image data should be discarded after analysis or failure.

## 12. Notification Requirements

- Notification permission must be requested only after user intent is clear.
- Users must be able to disable notifications.
- Reminder time must be user-configurable.
- Notification copy should be direct and specific.
- Unsupported notification environments must fail gracefully.

## 13. PWA Requirements

- The app must include a web app manifest.
- The app should include a service worker when needed for installability and notification support.
- The mobile installed experience must preserve core navigation.
- The app must remain usable from desktop browsers.

## 14. Design-System Requirements

The design system must separate generic UI from product-specific UI.

### 14.1 Generic UI

Generic primitives belong in `components/ui` or the equivalent project convention.

Examples:

- Button
- Input
- Label
- Select
- Card
- Progress
- Switch
- Empty state primitive

Rules:

- Generic UI must not import domain modules.
- Generic UI must not call APIs.
- Generic UI must not contain Nutrio-specific business copy unless intentionally modeled as a shared app primitive.
- Generic UI should accept props for content, state, and variants.

### 14.2 Layout UI

Layout and shell components should be separated from primitives.

Examples:

- App shell
- Bottom navigation
- Floating camera action
- Screen header
- Session provider wrapper

Rules:

- Layout components may understand app navigation.
- Layout components should not own meal, target, settings, or AI business rules.

### 14.3 Feature UI

Feature-specific components belong near their domain or in feature folders.

Examples:

- Dashboard macro cards
- Meal cards
- Analyze food result editor
- Target form
- Settings form

Rules:

- Feature UI may compose generic UI primitives.
- Feature UI may use domain types and domain-specific copy.
- Feature UI should not be promoted to shared UI until reuse is proven.

## 15. Folder And Domain Architecture Requirements

The codebase should keep routing, reusable UI, domain logic, infrastructure, and product features distinct.

Recommended target structure as the app grows:

```txt
src/
  app/
    api/
    layout.tsx
    page.tsx
  components/
    ui/
    layout/
    shared/
  features/
    auth/
    dashboard/
    analyze/
    history/
    meals/
    nutrition/
    targets/
    settings/
  lib/
    auth/
    notion/
    api/
    utils/
  styles/
    globals.css
```

This structure is a target, not a requirement to prematurely move small files. The project should migrate when boundaries become unclear or when a domain has enough files to justify ownership.

Architecture rules:

- `app` should own routes, layouts, and route-level composition.
- `components/ui` should contain reusable domain-agnostic primitives.
- `components/layout` should contain app shell and navigation components.
- `features/*` should contain business-domain UI and logic.
- `lib/notion` should contain Notion persistence adapters.
- `lib/auth` should contain authentication helpers and session logic when the module grows.
- Domain code may import design-system UI.
- Design-system UI must not import domain code.
- Client-only modules must not force server-only modules into client bundles.
- Server-only secrets must remain outside client components.

## 16. Error Handling Requirements

- AI provider errors must show a retryable user-facing error.
- Invalid API keys must be reported without exposing secrets.
- Notion configuration errors must show setup-oriented messages.
- Meal save failures must not show the meal as saved.
- Meal archive actions must require confirmation before mutating Notion.
- Empty states must be distinct from error states.
- Validation errors must identify the field that needs correction.

## 17. Acceptance Criteria

The MVP satisfies this SRS when:

- Authenticated users can log in with Google.
- Users can take or upload food photos.
- Images are compressed before analysis.
- AI returns editable macro estimates.
- Users can save corrected meal metadata.
- Food images are not permanently stored.
- Meals, targets, users, and settings persist in Notion.
- Users can view today's progress and meal history.
- Users can configure targets and settings.
- Users can initialize targets with a metric TDEE calculator without storing calculator inputs.
- Notifications can be configured where supported.
- The app works as a mobile-first PWA.
- The codebase keeps generic UI separate from feature/domain code.
- API routes enforce user ownership for user-specific data.

## 18. Deferred Requirements

The following requirements are outside the MVP unless explicitly reprioritized:

- Additional AI providers beyond OpenRouter
- WhatsApp integration
- Telegram integration
- Barcode scanning
- Nutrition database search
- Subscription system
- Social features
- Family dashboards
- Wearable integrations
- Permanent food image storage
