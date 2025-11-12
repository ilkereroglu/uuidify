import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorProbe } from "./components/ErrorProbe";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://dashboard.uuidify.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UUIDify Dashboard",
    template: "%s · UUIDify Dashboard",
  },
  description:
    "Live UUIDify API telemetry showcasing health, latency, request volume, and uptime trends.",
  openGraph: {
    title: "UUIDify Dashboard",
    description:
      "Live UUIDify API telemetry showcasing health, latency, request volume, and uptime trends.",
    url: siteUrl,
    siteName: "UUIDify Dashboard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UUIDify Dashboard",
    description:
      "Modern analytics view for UUIDify with health, latency, and usage metrics.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="bg-background">
      <body className={`${inter.variable} bg-background text-foreground`}>
        <ErrorProbe />
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
