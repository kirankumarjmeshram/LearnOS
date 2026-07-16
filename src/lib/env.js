import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required."),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required."),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required."),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required."),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required."),
  GOOGLE_REDIRECT_URI: z.string().url("GOOGLE_REDIRECT_URI must be a valid URL."),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL."),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required."),
});

const geminiEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required."),
});

const mongoEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
});

function parseEnvironment(schema, values) {
  const result = schema.safeParse(values);
  if (result.success) return result.data;
  throw new Error(`Invalid LearnOS environment configuration:\n${result.error.issues.map((issue) => `- ${issue.message}`).join("\n")}`);
}

export function getServerEnv() { return parseEnvironment(serverEnvSchema, process.env); }
export function getPublicEnv() { return parseEnvironment(publicEnvSchema, process.env); }
export function getGeminiEnv() { return parseEnvironment(geminiEnvSchema, process.env); }
export function getMongoEnv() { return parseEnvironment(mongoEnvSchema, process.env); }
