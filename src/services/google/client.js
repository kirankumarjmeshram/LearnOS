import "server-only";

import { google } from "googleapis";
import { getServerEnv } from "@/lib/env";

export function createGoogleOAuthClient() {
  const env = getServerEnv();
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);
}
