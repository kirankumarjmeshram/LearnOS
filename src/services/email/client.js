import "server-only";

import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";

let client;
export function getResendClient() {
  if (!client) client = new Resend(getServerEnv().RESEND_API_KEY);
  return client;
}
