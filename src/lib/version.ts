// Version information for Focloireacht
export const APP_VERSION = "1.0.0";
export const BUILD_DATE = new Date().toISOString().split("T")[0];
export const LAST_UPDATED = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function getVersionInfo() {
  return {
    version: APP_VERSION,
    buildDate: BUILD_DATE,
    lastUpdated: LAST_UPDATED,
    gitCommit:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      "development",
    environment: process.env.NODE_ENV || "development",
  };
}
