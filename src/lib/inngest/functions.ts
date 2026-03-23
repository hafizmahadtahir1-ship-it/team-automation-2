import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello.world" }],
  },
  async ({ event }) => {
    console.log("Hello from Inngest!", event);

    return {
      message: "Function executed successfully",
    };
  }
);