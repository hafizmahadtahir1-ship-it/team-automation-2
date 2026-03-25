import { inngest } from "./client";

export const processApproval = inngest.createFunction(
  { 
    id: "process-approval",
    triggers: [{ event: "slack/slash.received" }]
  },
  async ({ event, step }: any) => {
    console.log("Processing approval:", event.data);
  }
);