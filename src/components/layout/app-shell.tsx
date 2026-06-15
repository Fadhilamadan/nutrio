"use client";

import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { FloatingCameraButton } from "@/components/layout/floating-camera-button";
import { NotificationPoller } from "@/components/layout/notification-poller";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { LoadingCard } from "@/components/shared/loading-card";
import { NotionErrorCard } from "@/components/shared/notion-error-card";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/ui/error-card";
import { LoginScreen } from "@/features/auth/components/login-screen";
import { useUser } from "@/features/auth/hooks/use-user";
import { useTodayMeals } from "@/features/dashboard/hooks/use-today-meals";
import { useHistoryMeals } from "@/features/history/hooks/use-history-meals";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useTargets } from "@/features/targets/hooks/use-targets";
import { deleteMeal as deleteMealApi, saveMeal, updateMeal as updateMealApi } from "@/lib/api";
import { dateKey } from "@/lib/date";
import type { Meal, Screen } from "@/lib/types";

const gradientDecoration = (
  <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_20%_10%,rgba(98,174,240,0.18),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(214,182,246,0.22),transparent_28%)]" />
);

const AnalyzeFoodScreen = lazy(() =>
  import("@/features/analyze/components/analyze-food-screen").then((m) => ({ default: m.AnalyzeFoodScreen })),
);
const TodayDashboard = lazy(() =>
  import("@/features/dashboard/components/today-dashboard").then((m) => ({ default: m.TodayDashboard })),
);
const HistoryScreen = lazy(() =>
  import("@/features/history/components/history-screen").then((m) => ({ default: m.HistoryScreen })),
);
const SettingsScreen = lazy(() =>
  import("@/features/settings/components/settings-screen").then((m) => ({ default: m.SettingsScreen })),
);
const TargetsScreen = lazy(() =>
  import("@/features/targets/components/targets-screen").then((m) => ({ default: m.TargetsScreen })),
);
const ProfileScreen = lazy(() =>
  import("@/features/auth/components/profile-screen").then((m) => ({ default: m.ProfileScreen })),
);

function todayDateParam() {
  return new Date().toISOString().slice(0, 10);
}

const headerCopy: Record<Screen, { eyebrow: string; title: string }> = {
  dashboard: { eyebrow: "Nutrio", title: "Today" },
  analyze: { eyebrow: "AI analysis", title: "Analyze food" },
  history: { eyebrow: "Nutrition metadata", title: "History" },
  targets: { eyebrow: "Daily goals", title: "Targets" },
  settings: { eyebrow: "Private by design", title: "Settings" },
  profile: { eyebrow: "Google account", title: "Profile" },
};

export function AppShell() {
  const { activeUser, authError, status } = useUser();
  const { todayMeals, todayError, prependTodayMeal, updateTodayMeal, removeTodayMeal } = useTodayMeals(activeUser);
  const {
    historyMeals,
    historyQuery,
    historyHasMore,
    isLoadingMoreHistory,
    historyError,
    refreshHistory,
    loadMoreHistory,
    prependHistoryMeal,
    updateHistoryMeal,
    removeHistoryMeal,
  } = useHistoryMeals(activeUser);
  const { targets, targetsError, saveTargets } = useTargets(activeUser);
  const { settings, settingsError, isLoadingSettings, installPrompt, defaultModels, saveSettings, installPwa, requestNotifications } =
    useSettings(activeUser);

  const [screen, setScreen] = useState<Screen>("dashboard");

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--background)] p-5 text-[var(--foreground)]">
        <div className="w-full max-w-[360px]">
          <LoadingCard title="Opening Nutrio" message="Checking your session before loading nutrition data." />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  if (authError) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[var(--background)] p-5 text-[var(--foreground)]">
        <ErrorCard title="Cannot load Google user" message={authError} onRetry={() => window.location.reload()} />
      </main>
    );
  }

  if (!activeUser) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[var(--background)] p-5 text-[var(--foreground)]">
        <div className="w-full max-w-[360px]">
          <LoadingCard title="Connecting profile" message="Matching your Google account to a Notion user record." />
        </div>
      </div>
    );
  }

  const copy = headerCopy[screen];
  const dataError = todayError || historyError || targetsError || settingsError;

  async function addMeal(meal: Omit<Meal, "id" | "time">) {
    try {
      const savedMeal = await saveMeal(meal);
      if (dateKey(savedMeal.date) === todayDateParam()) {
        prependTodayMeal(savedMeal);
      }
      if (!historyQuery.trim()) {
        prependHistoryMeal(savedMeal);
      }
      setScreen("history");
    } catch (error) {
      console.error("Failed to save meal:", error);
    }
  }

  async function updateMeal(meal: Meal) {
    try {
      const savedMeal = await updateMealApi(meal);
      updateTodayMeal(savedMeal);
      updateHistoryMeal(savedMeal);
    } catch (error) {
      throw error;
    }
  }

  async function deleteMeal(id: string) {
    try {
      await deleteMealApi(id);
      removeTodayMeal(id);
      removeHistoryMeal(id);
    } catch (error) {
      throw error;
    }
  }

  const isLoadingData = isLoadingSettings && !dataError;

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] md:grid md:place-items-center md:p-6">
      <NotificationPoller
        notificationsEnabled={Boolean(settings?.notifications)}
        reminderTime={targets?.reminderTime}
        meals={todayMeals}
        targets={targets}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[var(--background)] shadow-[var(--shadow-elevated)] md:h-[min(920px,calc(100dvh-3rem))] md:rounded-[2rem]"
      >
        {gradientDecoration}
        <main className="relative flex-1 overflow-y-auto px-5 pb-44 pt-[max(1.25rem,env(safe-area-inset-top))] scrollbar-none">
          <ScreenHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            action={
              screen === "analyze" ? (
                <Button size="sm" variant="ghost" onClick={() => setScreen("dashboard")}>
                  Cancel
                </Button>
              ) : null
            }
          />
          <div className="mt-6 space-y-5">
            {dataError ? <NotionErrorCard message={dataError} onRetry={() => window.location.reload()} /> : null}
            {isLoadingData ? (
              <LoadingCard title="Loading Notion data" message="Fetching meals, settings, and any saved targets." />
            ) : null}
            {!isLoadingData && settings ? (
              <AnimatePresence mode="wait">
                {screen === "dashboard" ? (
                  <Suspense key="dashboard" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <TodayDashboard
                        user={activeUser}
                        meals={todayMeals}
                        targets={targets}
                        onConfigureTargets={() => setScreen("targets")}
                      />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
                {screen === "analyze" ? (
                  <Suspense key="analyze" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <AnalyzeFoodScreen user={activeUser} settings={settings} onSaveMeal={addMeal} />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
                {screen === "history" ? (
                  <Suspense key="history" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <HistoryScreen
                        user={activeUser}
                        meals={historyMeals}
                        query={historyQuery}
                        hasMore={historyHasMore}
                        isLoadingMore={isLoadingMoreHistory}
                        onQueryChange={refreshHistory}
                        onLoadMore={loadMoreHistory}
                        onEditMeal={updateMeal}
                        onDeleteMeal={deleteMeal}
                      />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
                {screen === "targets" ? (
                  <Suspense key="targets" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <TargetsScreen targets={targets} onSave={saveTargets} />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
                {screen === "settings" ? (
                  <Suspense key="settings" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <SettingsScreen
                        settings={settings}
                        defaultModels={defaultModels}
                        canInstallPwa={Boolean(installPrompt)}
                        onInstallPwa={installPwa}
                        onRequestNotifications={requestNotifications}
                        onSave={saveSettings}
                      />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
                {screen === "profile" ? (
                  <Suspense key="profile" fallback={<LoadingCard title="Loading" message="" rows={1} />}>
                    <ErrorBoundary>
                      <ProfileScreen user={activeUser} />
                    </ErrorBoundary>
                  </Suspense>
                ) : null}
              </AnimatePresence>
            ) : null}
          </div>
        </main>
        {screen !== "analyze" ? <FloatingCameraButton onClick={() => setScreen("analyze")} /> : null}
        <BottomNavigation active={screen} onNavigate={setScreen} />
      </motion.div>
    </div>
  );
}
