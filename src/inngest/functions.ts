import { inngest } from "./client";

export const processApproval = inngest.createFunction(
  { id: "process-approval" },
  { event: "slack/slash.received" },
  async ({ event, step }) => {
    console.log("Processing approval:", event.data);
  }
);