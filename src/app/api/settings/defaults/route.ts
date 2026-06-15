export async function GET() {
  return Response.json({
    Gemini: process.env.GEMINI_DEFAULT_MODEL,
    Groq: process.env.GROQ_DEFAULT_MODEL,
    OpenRouter: process.env.OPENROUTER_DEFAULT_MODEL,
    HuggingFace: process.env.HUGGINGFACE_DEFAULT_MODEL,
    Mistral: process.env.MISTRAL_DEFAULT_MODEL,
  });
}
