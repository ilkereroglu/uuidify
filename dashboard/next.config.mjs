const DEFAULT_REFRESH_INTERVAL =
  process.env.DEFAULT_REFRESH_INTERVAL ?? "30000";
const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.uuidify.io";
const ERROR_ENDPOINT =
  process.env.ERROR_ENDPOINT ?? "https://api.uuidify.io/log";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_DEFAULT_REFRESH_INTERVAL: DEFAULT_REFRESH_INTERVAL,
    NEXT_PUBLIC_API_BASE_URL: API_BASE_URL,
    NEXT_PUBLIC_ERROR_ENDPOINT: ERROR_ENDPOINT,
  },
};

export default nextConfig;
