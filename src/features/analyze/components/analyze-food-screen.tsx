"use client";

import { useRef, useState, useTransition } from "react";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { KeyRound, LoaderCircle, Save, Settings as SettingsIcon } from "lucide-react";

import { LoadingCard } from "@/components/shared/loading-card";
import { Button } from "@/components/ui/button";
import {
  AIAnalysisResultEditor,
  type AIAnalysisResultEditorHandle,
} from "@/features/analyze/components/ai-analysis-result-editor";
import { ImageUploader } from "@/features/analyze/components/image-uploader";
import { analyzeFoodImage, createMealFromAnalysis } from "@/lib/api";
import type { AnalysisResult, Meal, Settings, User } from "@/lib/types";

type AnalyzeFoodScreenProps = {
  user: User;
  settings: Settings;
  onSaveMeal: (meal: Omit<Meal, "id" | "time">) => Promise<void> | void;
  onNavigateToSettings: () => void;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AnalyzeFoodScreen({ user, settings, onSaveMeal, onNavigateToSettings }: AnalyzeFoodScreenProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalResult, setOriginalResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<AIAnalysisResultEditorHandle>(null);

  function selectImage(file: File | null) {
    setImageFile(file);
    setImageName(file?.name ?? "");
    setResult(null);
    setOriginalResult(null);
    setError("");
  }

  function runAnalysis() {
    if (!imageFile) return;
    setError("");
    startTransition(async () => {
      try {
        const compressed = await imageCompression(imageFile, {
          maxWidthOrHeight: 1280,
          initialQuality: 0.7,
          fileType: "image/webp",
          useWebWorker: true,
        });
        const imageBase64 = await fileToDataUrl(compressed);
        const analysis = await analyzeFoodImage({
          imageBase64,
          provider: settings.aiProvider,
          model: settings.aiModel,
          apiKey: settings.apiKey,
        });
        setResult(analysis);
        setOriginalResult(analysis);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to analyze image.");
      }
    });
  }

  async function saveMeal() {
    if (!result || !editorRef.current?.validate()) return;
    setIsSaving(true);
    try {
      await onSaveMeal(createMealFromAnalysis(user.id, result));
      setImageFile(null);
      setImageName("");
      setResult(null);
      setOriginalResult(null);
    } catch {
      setError("Failed to save meal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      {!settings.apiKey ? (
        <div className="surface-card rounded-xl p-5">
          <div className="flex gap-4">
            <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-[var(--primary)]">
              <KeyRound className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold tracking-[-0.0125em] text-[var(--ink)]">Start analyzing food</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                Connect an AI provider in Settings to analyze your meals. Your API key stays in your browser, never on
                our servers.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={onNavigateToSettings}>
                <SettingsIcon className="size-4" />
                Go to Settings
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ImageUploader imageName={imageName} onSelectImage={selectImage} />
          <Button className="w-full" size="lg" disabled={!imageName || isPending} onClick={runAnalysis}>
            {isPending ? <LoaderCircle className="size-5 animate-spin" /> : null}
            {isPending ? "AI scanning plate" : "Analyze food"}
          </Button>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">{error}</div>
          ) : null}
          {isPending ? (
            <LoadingCard
              title="Estimating nutrition"
              message={`${settings.aiProvider} is reading the image and returning editable macro metadata.`}
              rows={4}
            />
          ) : null}
          {result && originalResult ? (
            <AIAnalysisResultEditor
              ref={editorRef}
              result={result}
              originalResult={originalResult}
              onChange={setResult}
            />
          ) : null}
          {result ? (
            <Button className="w-full" size="lg" disabled={isSaving} onClick={saveMeal}>
              {isSaving ? <LoaderCircle className="size-5 animate-spin" /> : <Save className="size-5" />}
              {isSaving ? "Saving to history" : "Save meal metadata"}
            </Button>
          ) : null}
        </>
      )}
    </motion.section>
  );
}
