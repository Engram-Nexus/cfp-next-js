import type { Metadata } from "next";
import "./globals.css";
import "./markdown.css";
import { inter } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Engram Nexus",
  description: "Engram Nexus",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
