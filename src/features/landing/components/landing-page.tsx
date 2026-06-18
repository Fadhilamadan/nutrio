"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { motion, type Transition, useReducedMotion } from "framer-motion";
import { ArrowDown, BarChart3, Camera, ChevronDown, History, ShieldCheck, Sparkles, Target } from "lucide-react";

import { AppFooter } from "@/components/shared/app-footer";
import { Button } from "@/components/ui/button";

const ease: Transition["ease"] = [0.16, 1, 0.3, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const staggerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

const faqItems = [
  {
    question: "How does Nutrio analyze my food?",
    answer:
      "Snap a photo of your meal. Nutrio sends it to an AI provider that estimates calories, protein, carbs, and fat. The image is processed transiently and never stored permanently. Your nutritional history is securely saved so you can track patterns over time.",
  },
  {
    question: "How accurate is the AI analysis?",
    answer:
      "Accuracy depends on photo quality and meal complexity. Nutrio supports multiple AI providers so you can choose what works best for you. Results are always editable \u2014 tap any value to adjust it after analysis.",
  },
  {
    question: "Is my data private?",
    answer: "Yes \u2014 images never stored, only macro metadata is saved \u2014 nothing shared.",
  },
  {
    question: "What happens to my food photos?",
    answer: "Processed temporarily for AI analysis, immediately discarded. Nothing is saved.",
  },
  {
    question: "Can I self-host Nutrio?",
    answer:
      "Yes \u2014 the repo is open-source. You can deploy your own instance and connect it to your own Notion workspace and preferred AI provider.",
  },
  {
    question: "Do I need a paid account?",
    answer: "Free to use. Just need a Google account.",
  },
  {
    question: "Which AI providers are supported?",
    answer: "Gemini, Groq, OpenRouter, HuggingFace, and Mistral \u2014 configure your preference in settings.",
  },
];

export function LandingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="relative min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        <div
          aria-hidden
          className="absolute -left-32 top-10 size-80 rounded-full bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-52 size-64 rounded-full bg-[color-mix(in_srgb,var(--accent-purple)_8%,transparent)] blur-3xl"
        />
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-[600px]"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--primary)]">
            <Sparkles className="size-4" />
            Nutrio
          </div>
          <h1 className="text-4xl font-black tracking-[-0.05em] md:text-5xl lg:text-6xl">AI macros for every plate.</h1>
          <p className="mx-auto mt-4 max-w-[65ch] text-base leading-7 text-[var(--ink-muted)]">
            Snap a photo of your meal. Nutrio instantly analyzes calories, protein, carbs, and fat — no manual logging,
            no guesswork. Private by design.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => scrollTo("cta-section")}>
              Get started
            </Button>
            <Button size="lg" variant="secondary" onClick={() => scrollTo("what-section")}>
              Learn more
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? false : { opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={() => scrollTo("what-section")}
            aria-label="Scroll to learn more"
            className="flex size-10 items-center justify-center rounded-full text-[var(--ink-faint)] transition-colors hover:text-[var(--ink-muted)]"
          >
            <ArrowDown className="size-5" />
          </button>
        </motion.div>
      </section>

      <motion.section
        id="what-section"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="border-t border-[var(--hairline)] px-5 py-24"
      >
        <div className="mx-auto max-w-[1000px]">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.03em] md:text-4xl">
                Nutrition tracking, but make it effortless.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-muted)]">
                Most food tracking apps feel like a second job. Nutrio strips away the friction: take a photo, let AI
                handle the rest. Calories, protein, carbs, and fat appear in seconds — no typing, no searching, no
                guesswork.
              </p>
              <p className="mt-3 text-base leading-7 text-[var(--ink-muted)]">
                Your meals are saved automatically so you can track patterns over time. Food images are analyzed
                transiently and never stored — nothing shared.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Camera, label: "Snap a photo" },
                { icon: Sparkles, label: "AI analyzes instantly" },
                { icon: BarChart3, label: "See macros in seconds" },
                { icon: History, label: "Auto-saved" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial={shouldReduceMotion ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerVariants}
                  className="surface-card soft-shadow flex flex-col items-center gap-3 rounded-xl p-6 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                    <item.icon className="size-6" />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="border-t border-[var(--hairline)] px-5 py-24"
      >
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black tracking-[-0.03em] md:text-4xl">Know what fuels you.</h2>
            <p className="mx-auto mt-4 max-w-[65ch] text-base leading-7 text-[var(--ink-muted)]">
              Studies show people underestimate their intake by up to{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/1454084/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-[var(--ink-muted)]"
              >
                50%
              </a>
              . Awareness is the first step toward better choices — and Nutrio makes it effortless.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Build awareness",
                body: "See the real nutritional profile of every meal. No more guessing whether you hit your protein goal or went over on carbs.",
              },
              {
                icon: BarChart3,
                title: "Track without effort",
                body: "Traditional logging takes 5+ minutes per meal. Nutrio cuts that to under 10 seconds. Consistency becomes sustainable.",
              },
              {
                icon: ShieldCheck,
                title: "Stay private",
                body: "Food images are analyzed transiently and never stored. Only nutritional metadata is saved — nothing else.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerVariants}
                className="surface-card soft-shadow rounded-xl p-6"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                  <card.icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="border-t border-[var(--hairline)] px-5 py-24"
      >
        <div className="mx-auto max-w-[1000px]">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1">
              <div className="surface-card soft-shadow divide-y divide-[var(--hairline)] overflow-hidden rounded-xl">
                {[
                  {
                    step: "01",
                    icon: Camera,
                    title: "Snap a photo",
                    desc: "Take a picture of your meal with your phone\u2019s camera or upload from your gallery.",
                  },
                  {
                    step: "02",
                    icon: Sparkles,
                    title: "AI analyzes instantly",
                    desc: "Calories, protein, carbs, and fat appear in seconds. Review and edit if needed.",
                  },
                  {
                    step: "03",
                    icon: History,
                    title: "Auto-saved",
                    desc: "Only nutritional metadata is stored. Images are discarded after analysis — nothing saved.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    custom={i}
                    initial={shouldReduceMotion ? false : "hidden"}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerVariants}
                    className="flex items-start gap-4 p-5"
                  >
                    <span className="mt-0.5 text-xs font-bold tracking-[0.15em] text-[var(--ink-faint)]">
                      {item.step}
                    </span>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                      <item.icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-5 text-[var(--ink-muted)]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-black tracking-[-0.03em] md:text-4xl">Small habit, big difference.</h2>
              <p className="mt-4 text-base leading-7 text-[var(--ink-muted)]">
                A single photo per meal is all it takes. Over days and weeks, those snapshots become a nutritional diary
                that reveals patterns you never noticed — and empowers you to make intentional choices.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Understand your eating patterns without spreadsheets",
                  "Hit macro targets with confidence, not guesswork",
                  "Build a logged history that grows more valuable every day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--ink-muted)]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="faq-section"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="border-t border-[var(--hairline)] px-5 py-24"
      >
        <div className="mx-auto max-w-[700px]">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            FAQ
          </p>
          <h2 className="text-center text-3xl font-black tracking-[-0.03em] md:text-4xl">
            Frequently asked questions.
          </h2>
          <div className="surface-card soft-shadow mt-12 divide-y divide-[var(--hairline)] overflow-hidden rounded-xl">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)]"
                >
                  {item.question}
                  <ChevronDown
                    className="size-4 shrink-0 text-[var(--ink-faint)] transition-transform duration-300"
                    style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-[var(--ink-muted)]">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section
        id="cta-section"
        className="border-t border-[var(--hairline)] bg-[var(--surface)] px-5 py-24 text-center"
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[480px]"
        >
          <h2 className="text-3xl font-black tracking-[-0.03em]">Ready to see what&apos;s on your plate?</h2>
          <p className="mt-3 text-base leading-7 text-[var(--ink-muted)]">
            No email signup. No profile to fill out. Just your Google account and your first meal.
          </p>
          <div className="mt-8">
            <Button className="w-full max-w-[360px]" size="lg" onClick={() => signIn("google")}>
              <ShieldCheck className="size-4" />
              Continue with Google
            </Button>
          </div>
          <p className="mt-4 text-xs text-[var(--ink-faint)]">
            Your data stays private. Images analyzed instantly, never stored.
          </p>
        </motion.div>
      </section>

      <AppFooter />
    </main>
  );
}
