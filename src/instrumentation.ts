export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: startCronJobs } = await import("./app/lib/cron");
    console.log("Starting cron jobs...");
    startCronJobs();
    console.log("Cron jobs initialized");
  }
}
