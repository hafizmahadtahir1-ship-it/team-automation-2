import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { 
  processApproval, 
  smartNudge, 
  dailyDigest,
  trialNudge 
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processApproval, smartNudge, dailyDigest, trialNudge],
});