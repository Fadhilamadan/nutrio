"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserProfileCard } from "@/features/auth/components/user-profile-card";
import type { User } from "@/lib/types";

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
          This authenticated user is connected to a Notion user record. Meals, targets, and settings are isolated by
          this user ID.
        </p>
      </section>
      <Button variant="secondary" className="w-full" onClick={() => signOut()}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </motion.section>
  );
}
