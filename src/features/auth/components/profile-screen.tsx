"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { GitFork, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserProfileCard } from "@/features/auth/components/user-profile-card";
import type { User } from "@/lib/types";
import { clearNutrioApiKeys } from "@/lib/utils";

type ProfileScreenProps = {
  user: User;
};

export function ProfileScreen({ user }: ProfileScreenProps) {
  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <UserProfileCard user={user} />
      <section className="surface-card rounded-xl p-5">
        <h2 className="text-lg font-bold text-[var(--ink)]">Google account</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          This authenticated user has a connected profile. Meals, targets, and settings are isolated by this user ID.
        </p>
      </section>
      <section className="surface-card rounded-xl p-5">
        <div className="flex items-start gap-3">
          <GitFork className="mt-0.5 size-5 shrink-0 text-[var(--ink-muted)]" />
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]">Open Source</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              Nutrio is open source and built in public. Explore the{" "}
              <a
                href="https://github.com/Fadhilamadan/nutrio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] underline underline-offset-2"
              >
                source code
              </a>
              ,{" "}
              <a
                href="https://github.com/Fadhilamadan/nutrio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] underline underline-offset-2"
              >
                self-host your own instance
              </a>
              , or help shape the project{" "}
              <a
                href="https://github.com/Fadhilamadan/nutrio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] underline underline-offset-2"
              >
                on GitHub
              </a>
              . Pull requests welcome.
            </p>
          </div>
        </div>
      </section>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          clearNutrioApiKeys();
          signOut({ callbackUrl: "/" });
        }}
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </motion.section>
  );
}
