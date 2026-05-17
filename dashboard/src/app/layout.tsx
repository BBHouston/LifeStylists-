import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFESTYLIST $LIFE — Launch Dashboard",
  description:
    "Real-time launch dashboard for the $LIFE meme coin — bonding curve, sentiment, holders, and automated alerts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
