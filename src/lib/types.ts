export type Screen = "dashboard" | "analyze" | "history" | "targets" | "settings" | "profile";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Parent" | "Adult" | "Teen";
  color: string;
};

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Meal = {
  id: string;
  userId: string;
  name: string;
  date: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingEstimate: string;
  items: string[];
  confidence: number;
  notes: string;
  aiProvider: string;
  editedByUser: boolean;
};

export type AnalysisResult = Omit<Meal, "id" | "userId" | "date" | "time" | "editedByUser">;

export type MealPage = {
  items: Meal[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type Settings = {
  aiProvider: "Gemini" | "Groq" | "OpenRouter" | "HuggingFace" | "Mistral";
  aiModel: string;
  apiKey: string;
  notifications: boolean;
  pwaInstalled: boolean;
  theme: "System" | "Light" | "Dark";
};

export type MacroSummary = Pick<Meal, "calories" | "protein" | "carbs" | "fat">;
